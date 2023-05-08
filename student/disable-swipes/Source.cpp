#include <windows.h>
#include <stdio.h>
#include <hidusage.h>

// Function prototype for handling messages
LRESULT CALLBACK WindowProcedure(HWND, UINT, WPARAM, LPARAM);

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrevInst, LPSTR args, int nCmdShow) {
    WNDCLASSW wc = { 0 };

    wc.hbrBackground = (HBRUSH)COLOR_WINDOW;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hInstance = hInst;
    wc.lpszClassName = L"TouchpadBlocker";
    wc.lpfnWndProc = WindowProcedure;

    // Register the window class
    if (!RegisterClassW(&wc)) {
        return -1;
    }

    // Create the window
    HWND hwnd = CreateWindowW(wc.lpszClassName, L"TouchpadBlocker",
        WS_OVERLAPPEDWINDOW | WS_VISIBLE,
        100, 100, 250, 150,
        NULL, NULL, NULL, NULL);

    // Register for raw input from touchpad
    RAWINPUTDEVICE rid;
    rid.usUsagePage = 0x01; // Generic Desktop Controls
    rid.usUsage = 0x02;     // Mouse
    rid.dwFlags = RIDEV_INPUTSINK;
    rid.hwndTarget = hwnd;

    // Register the raw input device
    if (!RegisterRawInputDevices(&rid, 1, sizeof(rid))) {
        MessageBox(NULL, L"Failed to register raw input device.", L"Error", MB_ICONERROR | MB_OK);
        return -1;
    }

    // Main message loop
    MSG msg = { 0 };
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return 0;
}

LRESULT CALLBACK WindowProcedure(HWND hwnd, UINT msg, WPARAM wp, LPARAM lp) {
    switch (msg) {
    case WM_INPUT: {
        UINT dwSize = 0;

        // Get the size of the raw input data
        GetRawInputData((HRAWINPUT)lp, RID_INPUT, NULL, &dwSize, sizeof(RAWINPUTHEADER));

        // Allocate memory to store the raw input data
        LPBYTE lpb = new BYTE[dwSize];

        if (lpb == NULL) {
            return 0;
        }

        // Get the raw input data
        GetRawInputData((HRAWINPUT)lp, RID_INPUT, lpb, &dwSize, sizeof(RAWINPUTHEADER));

        // Process the raw input data
        RAWINPUT* raw = (RAWINPUT*)lpb;

        // Check if the raw input data is from a mouse
        if (raw->header.dwType == RIM_TYPEMOUSE) {
            // Handle raw input from the mouse and prevent it from being processed further
            delete[] lpb;
            return 0;
        }

        delete[] lpb;
        break;
    }

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;

    default:
        return DefWindowProcW(hwnd, msg, wp, lp);
    }

    return DefWindowProcW(hwnd, msg, wp, lp);
}
