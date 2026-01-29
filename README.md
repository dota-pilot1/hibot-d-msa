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
# hibot-d-msa
