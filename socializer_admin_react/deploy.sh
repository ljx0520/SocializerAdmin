#!/usr/bin/env bash

DIR=$(
  cd $(dirname $0)
  pwd
)

kubectl apply -f ${DIR}/k8s/deployment.yml
kubectl apply -f ${DIR}/k8s/service.yml
kubectl apply -f ${DIR}/k8s/ingress.yml

kubectl rollout restart deployment/socializer-admin-react -n socializer-admin

kubectl get pod -A
kubectl get service -A

echo -e "\n\n\n"

echo "success"
