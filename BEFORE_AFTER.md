# Backend File Structure - Before & After

## 📁 Before (Messy Mixed Architecture)

```
backend/functions/src/
├── core/
│   └── interfaces/                    ❌ Confusing name
│       ├── AnalyticsRepository.ts
│       ├── AssessmentRepository.ts    ❌ Should be in domain
│       ├── AuthService.ts             ❌ Should be in application
│       └── ...
│
├── domain/                            ❌ Wrong content
│   ├── flagDerivers/                  ❌ Business logic, not domain
│   ├── flagEngine.ts                  ❌ Business logic
│   └── scheduler/                     ❌ Business logic
│
├── infrastructure/                    ✅ Correct
│   ├── database/
│   ├── auth/
│   └── ...
│
├── interfaces/                        ❌ Name collision with TS
│   ├── api/                           ❌ Should be "adapters"
│   │   ├── admin/
│   │   ├── auth/
│   │   └── ...
│   └── triggers/                      ❌ Should be "events"
│
├── modules/                           ❌ Use cases scattered
│   ├── admin/
│   │   └── usecases/                  ❌ Should be centralized
│   ├── assessment/
│   │   └── usecases/
│   └── ...
│
├── middleware/                        ✅ Correct
└── shared/                            ✅ Correct
```

**Problems**:
- 😕 "core" and "interfaces" are not standard Clean Architecture terms
- 😕 Domain layer has business logic instead of entities
- 😕 Use cases scattered across modules
- 😕 No clear application layer
- 😕 Confusing naming ("interfaces" = API handlers?)

---

## 📁 After (Clean Architecture)

```
backend/functions/src/
├── domain/                            ✅ DOMAIN LAYER
│   ├── repositories/                  ✅ Repository interfaces
│   │   ├── IAnalyticsRepository.ts    ✅ I-prefix naming
│   │   ├── IAssessmentRepository.ts
│   │   ├── IOrganizationRepository.ts
│   │   └── ... (8 total)
│   │
│   ├── entities/                      🔜 To be implemented
│   │   ├── Student.ts
│   │   ├── Teacher.ts
│   │   └── Assessment.ts
│   │
│   ├── value-objects/                 🔜 To be implemented
│   │   ├── Email.ts
│   │   └── PhoneNumber.ts
│   │
│   └── events/                        🔜 To be implemented
│       ├── AssessmentSubmitted.ts
│       └── HighRiskDetected.ts
│
├── application/                       ✅ APPLICATION LAYER
│   ├── use-cases/                     ✅ Centralized use cases
│   │   ├── admin/
│   │   │   ├── createOrganization.usecase.ts
│   │   │   └── createSchool.usecase.ts
│   │   ├── assessment/
│   │   │   ├── submitAssessment.usecase.ts
│   │   │   └── getResults.usecase.ts
│   │   └── ... (6 categories)
│   │
│   ├── services/                      ✅ Service interfaces
│   │   ├── IAuthService.ts            ✅ I-prefix naming
│   │   ├── INotificationService.ts
│   │   └── ITenantContextService.ts
│   │
│   └── dto/                           🔜 To be implemented
│       ├── CreateStudentDto.ts
│       └── AssessmentResultDto.ts
│
├── infrastructure/                    ✅ INFRASTRUCTURE LAYER
│   ├── database/                      ✅ Implements domain repositories
│   │   ├── FirestoreOrganizationRepository.ts  # implements IOrganizationRepository
│   │   ├── FirestoreUserRepository.ts          # implements IUserRepository
│   │   └── ...
│   │
│   ├── auth/                          ✅ Implements application services
│   │   └── FirebaseAuthService.ts              # implements IAuthService
│   │
│   ├── assessment/
│   ├── analytics/
│   └── ...
│
├── adapters/                          ✅ ADAPTERS LAYER
│   ├── http/                          ✅ HTTP handlers (was api)
│   │   ├── admin/
│   │   │   ├── createOrganization.ts
│   │   │   └── createSchool.ts
│   │   ├── auth/
│   │   ├── assessments/
│   │   └── ... (11 categories)
│   │
│   └── events/                        ✅ Event handlers (was triggers)
│       ├── onUserCreated.ts
│       ├── onAssessmentSubmitted.ts
│       └── scheduledTasks.ts
│
├── business-logic/                    ✅ BUSINESS LOGIC
│   ├── flags/
│   │   ├── derivers/                  ✅ Flag derivation (from domain)
│   │   │   ├── grade6/
│   │   │   ├── grade7/
│   │   │   └── ...
│   │   └── engine.ts                  ✅ Flag engine
│   │
│   └── scheduler/                     ✅ Scheduler logic
│       ├── index.ts
│       └── ...
│
├── middleware/                        ✅ MIDDLEWARE
├── shared/                            ✅ SHARED
│   ├── config/
│   ├── types/
│   └── utils/
│
└── index.ts                           ✅ Entry point (updated exports)
```

**Benefits**:
- 😊 Clear separation of layers (Domain, Application, Infrastructure, Adapters)
- 😊 Easy to find files (use cases in one place)
- 😊 Standard naming (I-prefix for interfaces)
- 😊 No naming collisions
- 😊 Testable (can mock interfaces easily)
- 😊 Follows Clean Architecture principles

---

## 🔄 Key Transformations

| Before                                   | After                                              |
|------------------------------------------|----------------------------------------------------|
| `core/interfaces/OrganizationRepository` | `domain/repositories/IOrganizationRepository`      |
| `core/interfaces/AuthService`            | `application/services/IAuthService`                |
| `modules/admin/usecases/createOrg.ts`    | `application/use-cases/admin/createOrg.ts`         |
| `interfaces/api/admin/createSchool.ts`   | `adapters/http/admin/createSchool.ts`              |
| `interfaces/triggers/onUserCreated.ts`   | `adapters/events/onUserCreated.ts`                 |
| `domain/flagEngine.ts`                   | `business-logic/flags/engine.ts`                   |
| `domain/flagDerivers/grade6/phase1.ts`   | `business-logic/flags/derivers/grade6/phase1.ts`   |

---

## 📐 Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                     Frameworks                          │
│                   (index.ts exports)                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Adapters                              │
│           adapters/http, adapters/events                │
│         (Controllers, Event Handlers)                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Application                             │
│           application/use-cases                         │
│           application/services                          │
│              (Business Rules)                           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Domain                                │
│            domain/repositories                          │
│           domain/entities (TBD)                         │
│        (Core Business Logic)                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               Infrastructure                            │
│         infrastructure/database                         │
│            infrastructure/auth                          │
│      (External Services, Databases)                     │
└─────────────────────────────────────────────────────────┘
```

**Dependency Rule**: Arrows point inward. Inner layers know nothing about outer layers.

---

## 📊 File Count

| Location                      | Before | After  | Change      |
|-------------------------------|--------|--------|-------------|
| Domain interfaces             | 11     | 11     | Moved & renamed |
| Application services          | 0      | 3      | +3 new      |
| Use cases                     | ~20    | ~20    | Centralized |
| HTTP adapters                 | ~30    | ~30    | Renamed     |
| Event adapters                | 4      | 4      | Renamed     |
| Business logic                | ~38    | ~38    | Separated   |

**Total files affected**: ~100  
**New directories created**: 10  
**Old directories to be removed**: 7

---

## ✅ Verification

After cleanup, verify these directories **don't exist**:
- ❌ `core/interfaces/`
- ❌ `interfaces/api/`
- ❌ `interfaces/triggers/`
- ❌ `modules/admin/usecases/`
- ❌ `modules/assessment/usecases/`
- ❌ `domain/flagDerivers/`
- ❌ `domain/scheduler/`

And these **do exist**:
- ✅ `domain/repositories/`
- ✅ `application/use-cases/`
- ✅ `application/services/`
- ✅ `adapters/http/`
- ✅ `adapters/events/`
- ✅ `business-logic/flags/`
- ✅ `business-logic/scheduler/`

---

**Last Updated**: 2026-02-10  
**Migration Status**: Ready for cleanup
