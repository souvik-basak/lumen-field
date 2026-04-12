#!/bin/bash

# Configuration
PROJECT_ID="promptengineering007"
SERVICE_NAME="lumen-field"
REGION="us-central1"

echo "🚀 Starting deployment for $SERVICE_NAME to project $PROJECT_ID..."

# Set the GCP project
gcloud config set project $PROJECT_ID

# Deploy to Cloud Run
# This command builds the container image using Cloud Build and deploys it to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --source . \
    --region $REGION \
    --allow-unauthenticated \
    --project $PROJECT_ID

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed. Please check the logs."
    exit 1
fi
