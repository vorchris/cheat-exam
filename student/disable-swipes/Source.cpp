#include <Windows.h>
#include <iostream>

LRESULT CALLBACK LowLevelMouseProc(int nCode, WPARAM wParam, LPARAM lParam);
HHOOK hMouseHook;

int main() {
    // Set up a low-level mouse hook
    hMouseHook = SetWindowsHookEx(WH_MOUSE_LL, LowLevelMouseProc, GetModuleHandle(NULL), 0);

    if (!hMouseHook) {
        std::cerr << "Failed to set mouse hook." << std::endl;
        return 1;
    }

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    // Unhook before exiting
    UnhookWindowsHookEx(hMouseHook);
    return 0;
}

LRESULT CALLBACK LowLevelMouseProc(int nCode, WPARAM wParam, LPARAM lParam) {
    if (nCode == HC_ACTION) {
        switch (wParam) {
            case WM_LBUTTONDOWN:
            case WM_RBUTTONDOWN:
            case WM_MBUTTONDOWN:
            case WM_MOUSEWHEEL:
            case WM_MOUSEHWHEEL:
            case WM_XBUTTONDOWN:
                std::cout << "Mouse event intercepted: " << wParam << std::endl;
                // Consume the message to prevent the default action
                return 1;
        }
    }

    // Call the next hook in the chain
    return CallNextHookEx(hMouseHook, nCode, wParam, lParam);
}
