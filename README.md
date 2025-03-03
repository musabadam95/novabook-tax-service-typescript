# NovaBook Tax Service

NovaBook Tax Service is a TypeScript-based project designed to help users manage their tax-related tasks efficiently.

## Features

- User-friendly interface
- Secure data handling
- Automated tax calculations
- Comprehensive reporting

## Installation

To install the project, follow these steps:

1. Clone the repository:
  ```bash
  git clone https://github.com/musabadam95/novabook-tax-service-typescript.git
  ```
2. Navigate to the project directory:
  ```bash
  cd novabook-tax-service-typescript
  ```
3. Install the dependencies:
  ```bash
  npm install
  ```

## Usage

To start the project, run:
```bash
npm start
```

## APIs
### Ingest Endpoint
Allows a user to send sales and tax payment events to our service
#### POST
```bash
'http://localhost:5000/tax/transctions'
```
Request:
```bash
{
	“eventType”: “SALES”,
	“date”: "YYYY-MM-DDTHH:MM:SSZ"
	“invoiceId”: UUID,
	“items”: [{
		“itemId”: UUID,
		“cost”: number - amount in pennies,
		“taxRate”:  number (between 0-1)
	}]
}
```
Response:
```bash
200 OK
```

### Query Tax Position Endpoint
Allows a user to query their tax position at any given point in time. This should calculate the tax position from ingested events and any further user interaction
#### GET
```bash
'http://localhost:5000/tax/tax-position'
```
Request:
```bash
http://localhost:5000/tax/tax-position?date=YYYY-MM-DDTHH:MM:SSZ
```
Response:
```bash
200
{
    "date": "YYYY-MM-DDTHH:MM:SSZ",
    "taxPosition": number - amount in pennies
}
```

### Amend Sale Endpoint
Allows a user to modify an item within a sale at a specific point in time. The service must accept all amendments even if the sale or item does not yet exist. The sales event can be received by the service after the amendment.
#### PATCH
```bash
'http://localhost:5000/tax/sale'
```
Request:
```bash
{
        date: 'YYYY-MM-DDTHH:MM:SSZ',
        invoiceId: UUID,
        cost: number - amount in pennies,
        taxRate: number (between 0-1),
}
```
Response:
```bash
200 OK
```
