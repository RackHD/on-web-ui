#!/usr/bin/expect -f

set LAST_IP "137.69.148.64"
set NEXT_IP "137.69.148.105"

spawn ssh pi@137.69.148.132 "sudo sed -i \"s|$LAST_IP|$NEXT_IP|\" \"/boot/xinitrc\" && sudo reboot"
expect "assword:"
send "raspberry\r"
interact +++ return

spawn ssh pi@137.69.148.110 "sudo sed -i \"s|$LAST_IP|$NEXT_IP|\" \"/boot/xinitrc\" && sudo reboot"
expect "assword:"
send "raspberry\r"
interact +++ return

spawn ssh root@137.69.149.3 "sudo sed -i \"s|$LAST_IP|$NEXT_IP|\" \"/boot/xinitrc\" && sudo reboot"
expect "assword:"
send "onrack\r"
interact +++ return

spawn ssh root@137.69.149.10 "sudo sed -i \"s|$LAST_IP|$NEXT_IP|\" \"/boot/xinitrc\" && sudo reboot"
expect "assword:"
send "onrack\r"
interact +++ return
