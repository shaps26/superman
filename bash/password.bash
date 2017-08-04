#!/bin/bash
if [ -z $1 ]
then
	echo "tape ton pseudo"
	exit 2
fi
if [ -z $2 ]
then
	echo "tape ton mdp"
	exit 2
fi

serverUserInfo=`cat /etc/shadow | grep $1 | cut -d '/' -f1`
salt=`cat /etc/shadow | grep $1 | cut -d '$' -f3`
clientUserInfo=`mkpasswd -m sha-512 $2 -s $salt | cut -d '/' -f1`

if [ "$serverUserInfo" != "$1:$clientUserInfo" ]
then
	echo "invalid"
else
	echo "ok"
fi
exit 0
