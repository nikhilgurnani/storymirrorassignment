#!/bin/bash
npm install || echo 'npm install failed.'
cp .env.example .env
