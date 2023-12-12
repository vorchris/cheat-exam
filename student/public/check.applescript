

tell application "System Preferences"
	activate
	set the current pane to pane id "com.apple.preference.security"
end tell


tell application "System Events"
	tell window 1 of application process "System Preferences"
		
		#warten auf das UI
		set i to 0
		repeat until exists tab group 1
			delay 0.1
			set i to i + 1
			if i ≥ 10 then return
		end repeat
		click radio button 4 of tab group 1
	end tell
	select row 9 of table 1 of scroll area 1 of tab group 1 of window 1 of application process "System Preferences"
end tell


tell application "Mission Control" to launch
delay 0.25
tell application "System Events"
	try
		tell list 1 of group 2 of group 1 of group 1 of process "Dock"
			set countSpaces to count of buttons
			
			repeat until countSpaces is 1
				set countSpaces to count of buttons
				if countSpaces is greater than 1 then
					perform action "AXRemoveDesktop" of button countSpaces
				end if
			end repeat
			key code 53 -- # Esc
			click button 1
		end tell
	end try
end tell
