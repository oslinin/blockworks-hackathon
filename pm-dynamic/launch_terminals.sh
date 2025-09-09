#!/bin/bash

lxterminal \
  --command="bash -c 'htop; exec bash'" \
  --command="bash -c 'ping google.com; exec bash'" \
  --command="bash"
