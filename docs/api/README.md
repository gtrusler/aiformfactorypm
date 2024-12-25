# API Documentation

## Overview

This document outlines the API structure and usage for the AI Form Factory project.

## Authentication

All API endpoints require authentication using Bearer tokens:

```http
Authorization: Bearer <your_token>
```

## Endpoints

### Forms

#### Create Form

```http
POST /api/forms
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "fields": [
    {
      "type": "string",
      "label": "string",
      "required": boolean,
      "options": string[]
    }
  ]
}
```

#### Get Form

```http
GET /api/forms/{formId}
```

#### Update Form

```http
PUT /api/forms/{formId}
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "fields": [...]
}
```

#### Delete Form

```http
DELETE /api/forms/{formId}
```

### AI Integration

#### Generate Form

```http
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "string",
  "type": "string",
  "options": {
    "complexity": "simple" | "medium" | "complex",
    "industry": "string"
  }
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Error response format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user
- AI endpoints: 50 requests per hour per user

## Webhooks

Register webhook endpoints to receive form submission notifications:

```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "string",
  "events": ["form.submitted", "form.updated"],
  "secret": "string"
}
```

## Development

### Local Setup

1. Install dependencies
2. Set environment variables
3. Run development server

### Testing

```bash
# Run API tests
yarn test:api

# Run specific endpoint tests
yarn test:api forms
```

## Security

- All endpoints use HTTPS
- API keys must be kept secure
- Implement proper CORS settings
- Rate limiting prevents abuse
- Input validation on all endpoints

```

```
