#!/bin/bash

sudo docker build -t socializer_admin:latest .

docker tag socializer_admin registry.digitalocean.com/socialzer/socializer_admin

docker push registry.digitalocean.com/socialzer/socializer_admin