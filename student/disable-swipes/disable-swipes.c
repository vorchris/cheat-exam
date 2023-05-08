#include <windows.h>
#include <objbase.h>
#include <Windows.UI.Input.h>
#include <wrl.h>
#include <wrl/client.h>
#include <wrl/implements.h>
#include <wrl/wrappers/corewrappers.h>
#include <wrl/event.h>



int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    HRESULT hr = CoInitialize(NULL);
    if (FAILED(hr))
    {
        MessageBox(NULL, L"Failed to initialize COM library.", L"Error", MB_ICONERROR | MB_OK);
        return 0;
    }

    // Your code to create a window and message loop
    
    WNDCLASSW wc = {0};

    wc.hbrBackground = (HBRUSH)COLOR_WINDOW;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hInstance = hInst;
    wc.lpszClassName = L"TouchpadBlocker";
    wc.lpfnWndProc = WindowProcedure;

    if (!RegisterClassW(&wc)) {
        return -1;
    }

    HWND hwnd = CreateWindowW(wc.lpszClassName, L"TouchpadBlocker",
                              WS_OVERLAPPEDWINDOW | WS_VISIBLE,
                              100, 100, 250, 150,
                              NULL, NULL, NULL, NULL);


    MSG msg = {0};

    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    CoUninitialize();
    return 0;
}



LRESULT CALLBACK WindowProcedure(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    static Microsoft::WRL::ComPtr<IGestureRecognizer> gestureRecognizer;

    switch (uMsg)
    {
    case WM_CREATE:
    {
        HRESULT hr = RoInitialize(RO_INIT_MULTITHREADED);
        if (FAILED(hr))
        {
            MessageBox(NULL, L"Failed to initialize the Windows Runtime.", L"Error", MB_ICONERROR | MB_OK);
            return -1;
        }

        hr = RoGetActivationFactory(Microsoft::WRL::Wrappers::HStringReference(RuntimeClass_Windows_UI_Input_GestureRecognizer).Get(), IID_PPV_ARGS(&gestureRecognizer));
        if (FAILED(hr))
        {
            MessageBox(NULL, L"Failed to create GestureRecognizer.", L"Error", MB_ICONERROR | MB_OK);
            return -1;
        }
    }
    break;

    case WM_DESTROY:
        PostQuitMessage(0);
        break;

    case WM_POINTERDOWN:
    case WM_POINTERUPDATE:
    case WM_POINTERUP:
    {
        POINTER_INFO pointerInfo;
        if (GetPointerInfo(GET_POINTERID_WPARAM(wParam), &pointerInfo))
        {
            POINT pt = pointerInfo.ptPixelLocation;
            ScreenToClient(hwnd, &pt);

            Microsoft::WRL::ComPtr<IPointerPoint> pointerPoint;
            HRESULT hr = GestureRecognizerUtilities::CreatePointerPointForMouseMessage(hwnd, uMsg, wParam, lParam, &pointerPoint);
            if (SUCCEEDED(hr))
            {
                hr = gestureRecognizer->ProcessDownEvent(pointerPoint.Get());
            }

            // Prevent touchpad gestures from triggering system events
            return 0;
        }
    }
    break;

    default:
        return DefWindowProc(hwnd, uMsg, wParam, lParam);
    }

    return 0;
}

