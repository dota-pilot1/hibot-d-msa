# HiBot Docu MSA

키오스크 프로젝트 업무 관리 시스템 - MSA 버전

## 구조

```
hibot-docu-msa/
├── apps/
│   ├── api-gateway/       # NestJS - API Gateway
│   └── auth-service/      # Spring Boot - 인증 서비스 (예정)
├── packages/
│   └── shared/            # 공통 라이브러리 (DTO, Interface)
├── docker-compose.yml     # PostgreSQL, Redis
└── pnpm-workspace.yaml
```

## 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 인프라 실행 (PostgreSQL, Redis)

```bash
pnpm dev
# 또는
docker-compose up -d
```

### 3. API Gateway 실행

```bash
pnpm gateway
```

## 서비스 목록

| 서비스 | 포트 | 기술 | 상태 |
|--------|------|------|------|
| API Gateway | 3000 | NestJS | 개발 중 |
| Auth Service | 3001 | Spring Boot | 예정 |
| PostgreSQL | 5432 | - | 준비됨 |
| Redis | 6379 | - | 준비됨 |

## 개발 원칙

- Gateway는 교통경찰 역할만 (비즈니스 로직 금지)
- 처음부터 Kafka 안 깔아도 됨 (HTTP로 시작)
- DB 물리 분리보다 소유권 분리부터
- shared에 Entity/Repository 금지

## 왜 이 구조가 좋은가?

### apps/ 기준 분리

서비스 단위로 독립 (api-gateway, auth-service)

MSA 확장 시 폴더 하나 추가면 끝:

```
apps/
├── api-gateway/        # 현재
├── auth-service/       # 현재
├── user-service/       # 확장 예정
├── order-service/      # 확장 예정
├── campaign-service/   # 확장 예정
```

각 서비스는 독립적으로 빌드/배포 가능

## MSA 통신/이벤트 도입 가이드

### 기본 전제

- 초반: REST만 사용 (단순, 빠른 개발)
- 과설계 금지
- 필요가 생기는 순간에만 기술 추가

### 1. Kafka는 언제 붙이나?

아래 중 2개 이상 발생하면 도입:

- [ ] 한 이벤트를 여러 서비스가 소비 (ex. 주문 생성 → 결제 / 알림 / 로그)
- [ ] 부가 기능 실패가 메인 흐름을 막으면 안 됨 (알림 실패 ≠ 주문 실패)
- [ ] 비동기 처리 가능 (즉시 응답 불필요)
- [ ] 이벤트 기록 / 재처리 필요 (감사 로그, 리플레이)

### 2. Kafka 도입 방식

**1) 이벤트 정의**
```
OrderCreatedEvent
  - orderId
  - userId
  - amount
  - createdAt
```

**2) Producer (단일)**
- 상태 변경 발생 서비스
- `kafkaTemplate.send("order.created", event)`

**3) Consumer (다수)**
- payment-service
- notification-service
- log-service

※ 기존 REST API 거의 수정 없음

### 3. gRPC는 언제 붙이나?

- Kafka 이후
- 내부 서비스 간 고빈도 통신
- 낮은 지연, 고성능 필요할 때

### 4. gRPC 먼저 안 쓰는 이유

- 초반 API 변경 잦음
- 디버깅 불편
- REST가 생산성 높음

### 5. 권장 도입 순서

```
1. REST   (모든 서비스)
2. Kafka  (이벤트 전파 필요 시)
3. gRPC   (내부 통신 최적화)
```

### 6. 역할 정리

| 기술 | 역할 |
|------|------|
| REST | 외부 API / 관리자 / 단순 호출 |
| Kafka | 상태 변화 이벤트 전파 |
| gRPC | 내부 고속 서비스 통신 |

### 한 줄 요약

- **Kafka** = "사건 발생 알림"
- **gRPC** = "빠른 내부 전화"

이 순서로 가면 과설계 없음, 실무 최적.
