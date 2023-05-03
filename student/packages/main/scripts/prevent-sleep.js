import ffi from 'ffi-napi';

// Define the Windows API function
const kernel32 = ffi.Library('kernel32.dll', {
  SetThreadExecutionState: ['uint32', ['uint32']],
});

// ES_CONTINUOUS: Informs the system that the state being set should remain in effect until the next call.
// ES_SYSTEM_REQUIRED: Resets the system idle timer.
const ES_CONTINUOUS = 0x80000000;
const ES_SYSTEM_REQUIRED = 0x00000001;

// Prevent sleep by resetting the system idle timer every 60 seconds
export function preventSleep() {
  kernel32.SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED);
  setTimeout(preventSleep, 60 * 1000);
}
