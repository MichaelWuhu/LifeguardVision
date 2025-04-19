# Lifeguard Vision

## setup instructions

## Frontend
Before doing any of the steps below, cd into the frontend folder
### 1. Install node_modules
```
npm install
```

### 2. Run the Dev Environment
```
npm run dev
```

#### 3. Open the App
go to http://localhost:3000/ and u should see somethin

----------------------------------------------------------------

## Backend
Before doing any of the steps below, cd into the backend folder and install python
### 1. Create a Virtual Environment
#### macOS/Linux:
```
python -m venv venv
source venv/bin/activate
```

#### Windows (PowerShell):
```
python -m venv venv
.\venv\Scripts\Activate.ps1
```

you might have to use ``python3`` instead of ``python`` (depends on which one u hav installed)

you should see (venv) before your path in the terminal like this:
<img width="752" alt="image" src="https://github.com/user-attachments/assets/a02f4086-4851-41fe-8065-96c9cc48659e" />

### 2. Install Dependencies
```
pip install -r requirements.txt
```

### 3. To Run the App
```
uvicorn main:app --reload
```

### 4. Open the Backend
go to http://127.0.0.1:8000/ and u should see somethin

### 5. To Exit the Virtual Environment Run
```
deactivate
```



