# Charging Sessions API - Pagination Documentation

## GET /api/charging-sessions

This endpoint retrieves charging sessions with pagination support and optional filtering.

**🔒 Security Update**: As of June 2025, this API uses DTOs to prevent sensitive data exposure. User passwords are no longer included in responses.

**📊 Stability Update**: Fixed Spring Data PageImpl serialization warnings for stable JSON structure.

### Request Parameters

#### Pagination Parameters

- `page` (optional, default: 0): Page number (0-based indexing)
- `size` (optional, default: 10): Number of items per page
- `sort` (optional, default: "id"): Sort field and direction (e.g., "id,desc", "startTime,asc")

#### Filter Parameters

- `userId` (optional): Filter by specific user ID
- `isCompleted` (optional): Filter by completion status (true/false)
- `isCharging` (optional): Filter by charging status (true/false)

### Example Requests

#### Basic pagination (default parameters)

```
GET /api/charging-sessions
```

#### Custom pagination

```
GET /api/charging-sessions?page=0&size=20&sort=id,desc
```

#### Filter by user

```
GET /api/charging-sessions?userId=1&page=0&size=10
```

#### Filter by status

```
GET /api/charging-sessions?isCompleted=false&isCharging=true
```

#### Combined filters and pagination

```
GET /api/charging-sessions?userId=1&isCompleted=false&page=0&size=5&sort=startTime,desc
```

### Response Format

The response follows Spring Data's `Page` interface format:

```json
{
  "content": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "isAdmin": false
        // Note: password field is NOT included for security
      },
      "vehicle": {
        "id": 1,
        "make": "Tesla",
        "model": "Model 3",
        "plateNumber": "ABC123",
        "batteryCapacity": 75000,
        "owner": {
          "id": 1,
          "email": "user@example.com",
          "name": "John Doe",
          "isAdmin": false
          // Note: password field is NOT included for security
        }
      },
      "station": {
        "id": 1,
        "name": "Downtown Charging Hub",
        "location": "123 Main St",
        "numberOfPumps": 4
      },
      "pumpNumber": 2,
      "isCompleted": false,
      "isReserved": true,
      "isCharging": false,
      "startTime": "2025-06-06T14:30:00.000Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "ascending": false,
      "criteria": [
        {
          "property": "id",
          "direction": "DESC"
        }
      ]
    }
  },
  "totalElements": 50,
  "totalPages": 5,
  "numberOfElements": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

### Response Fields

#### Pagination Metadata

- `totalElements`: Total number of charging sessions matching the criteria
- `totalPages`: Total number of pages
- `numberOfElements`: Number of elements in current page
- `first`: Whether this is the first page
- `last`: Whether this is the last page
- `empty`: Whether the page is empty

#### Content Fields

Each charging session object contains:

- `id`: Unique identifier
- `user`: User who created the session
- `vehicle`: Vehicle being charged
- `station`: EV charging station
- `pumpNumber`: Pump number at the station
- `isCompleted`: Whether the charging session is completed
- `isReserved`: Whether this is a reserved session
- `isCharging`: Whether the session is currently charging
- `startTime`: Scheduled start time for the session

### HTTP Status Codes

- `200 OK`: Successful retrieval
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

### Implementation Details

The endpoint uses:

- Spring Data JPA's `Pageable` interface for pagination
- `@PageableDefault` annotation for default pagination settings
- Custom JPQL query for flexible filtering
- Proper logging for debugging and monitoring

### Repository Query

The filtering is implemented using a custom JPQL query in `ChargingSessionRepository`:

```java
@Query("SELECT cs FROM ChargingSession cs WHERE " +
       "(:userId IS NULL OR cs.user.id = :userId) AND " +
       "(:isCompleted IS NULL OR cs.isCompleted = :isCompleted) AND " +
       "(:isCharging IS NULL OR cs.isCharging = :isCharging)")
Page<ChargingSession> findSessionsWithFilters(@Param("userId") Long userId,
                                             @Param("isCompleted") Boolean isCompleted,
                                             @Param("isCharging") Boolean isCharging,
                                             Pageable pageable);
```

This approach ensures that NULL filter values are ignored, making all filters truly optional.

## Security Update ⚠️

**IMPORTANT**: This API has been updated with security improvements. User passwords are no longer exposed in responses through the implementation of Data Transfer Objects (DTOs).

## Response Structure

### Secure Response Format

The API now returns DTOs (Data Transfer Objects) instead of raw entities to ensure sensitive data is not exposed:

```json
{
  "content": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "isAdmin": false
        // Note: password field is NOT included for security
      },
      "vehicle": {
        "id": 1,
        "make": "Tesla",
        "model": "Model 3",
        "plateNumber": "ABC123",
        "batteryCapacity": 75000,
        "owner": {
          "id": 1,
          "email": "user@example.com",
          "name": "John Doe",
          "isAdmin": false
          // Note: password field is NOT included for security
        }
      },
      "station": {
        "id": 1,
        "name": "Downtown Charging Hub",
        "location": "123 Main St",
        "numberOfPumps": 4
      },
      "pumpNumber": 2,
      "isCompleted": false,
      "isReserved": true,
      "isCharging": false,
      "startTime": "2025-06-06T14:30:00.000Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "ascending": false,
      "criteria": [
        {
          "property": "id",
          "direction": "DESC"
        }
      ]
    }
  },
  "totalElements": 50,
  "totalPages": 5,
  "numberOfElements": 10,
  "first": true,
  "last": false,
  "empty": false
}
```
