# API 문서

이 문서는 자동으로 생성된 API 문서입니다.
마지막 업데이트: 2025. 5. 25. 오전 4:22:33

---

## POST /users

**키:** `createUser`  
**설명:** 새 사용자 생성

### 🟦 요청(Request)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "minLength": 2
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "role": {
          "type": "string",
          "enum": [
            "admin",
            "user"
          ]
        }
      },
      "required": [
        "name",
        "email",
        "role"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### 🟩 응답(Response)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "role": {
          "type": "string",
          "enum": [
            "admin",
            "user"
          ]
        },
        "createdAt": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "name",
        "email",
        "role",
        "createdAt"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```
---

## DELETE /users/:id

**키:** `deleteUser`  
**설명:** 사용자 삭제

### 🟦 요청(Request)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "number"
        }
      },
      "required": [
        "id"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### 🟩 응답(Response)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "success": {
          "type": "boolean"
        }
      },
      "required": [
        "success"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```
---

## GET /users/:id

**키:** `getUser`  
**설명:** 사용자 정보 조회

### 🟦 요청(Request)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "number"
        }
      },
      "required": [
        "id"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### 🟩 응답(Response)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "role": {
          "type": "string",
          "enum": [
            "admin",
            "user"
          ]
        },
        "createdAt": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "name",
        "email",
        "role",
        "createdAt"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```
---

## GET /users

**키:** `getUsers`  
**설명:** 사용자 목록 조회

### 🟦 요청(Request)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "number"
        },
        "limit": {
          "type": "number"
        },
        "role": {
          "type": "string",
          "enum": [
            "admin",
            "user"
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### 🟩 응답(Response)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "number"
              },
              "name": {
                "type": "string"
              },
              "email": {
                "type": "string",
                "format": "email"
              },
              "role": {
                "type": "string",
                "enum": [
                  "admin",
                  "user"
                ]
              },
              "createdAt": {
                "type": "string"
              }
            },
            "required": [
              "id",
              "name",
              "email",
              "role",
              "createdAt"
            ],
            "additionalProperties": false
          }
        },
        "total": {
          "type": "number"
        }
      },
      "required": [
        "items",
        "total"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```
---

## PUT /users/:id

**키:** `updateUser`  
**설명:** 사용자 정보 수정

### 🟦 요청(Request)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "number"
        },
        "name": {
          "type": "string",
          "minLength": 2
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "role": {
          "type": "string",
          "enum": [
            "admin",
            "user"
          ]
        }
      },
      "required": [
        "id"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### 🟩 응답(Response)
```json
{
  "$ref": "#/definitions/Schema",
  "definitions": {
    "Schema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "role": {
          "type": "string",
          "enum": [
            "admin",
            "user"
          ]
        },
        "createdAt": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "name",
        "email",
        "role",
        "createdAt"
      ],
      "additionalProperties": false
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```
---