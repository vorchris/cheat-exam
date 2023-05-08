#include <windows.h>
#include <stdio.h>

// Function prototype for handling messages
LRESULT CALLBACK WindowProcedure(HWND, UINT, WPARAM, LPARAM);

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrevInst, LPSTR args, int nCmdShow) {
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

    return 0;
}

LRESULT CALLBACK WindowProcedure(HWND hwnd, UINT msg, WPARAM wp, LPARAM lp) {
    switch (msg) {
        case WM_INPUT:
            // Handle raw input here and prevent it from being processed further
            return 0;

        case WM_DESTROY:
            PostQuitMessage(0);
            return 0;

        default:
            return DefWindowProcW(hwnd, msg, wp, lp);
    }
}
