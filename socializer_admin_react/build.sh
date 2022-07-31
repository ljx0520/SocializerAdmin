#!/bin/bash

sudo docker build -t socializer_admin_react:latest .

docker tag socializer_admin_react registry.digitalocean.com/socialzer/socializer_admin_react

docker push registry.digitalocean.com/socialzer/socializer_admin_react