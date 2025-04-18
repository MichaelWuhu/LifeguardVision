# broncohacks2025

## setup instructions
### frontend
#### 
1. install node (v20 or later)

#### 2. 
```
cd frontend/
```

#### 3. 
```
npm install
```

#### 4. 
```
npm run dev
```

#### 5. 
go to http://localhost:3000/ and u should see somethin

----------------------------------------------------------------

### backend

#### 1. 
install python

#### 2.
```
cd backend/
```

#### 3.
```
python -m venv venv
```
-or- 
```
python3 -m venv venv
```
(depends on which one u hav installed)

#### 4. 
```
source venv/bin/activate
```
you should see (venv) before your path in the terminal like this:
<img width="752" alt="image" src="https://github.com/user-attachments/assets/a02f4086-4851-41fe-8065-96c9cc48659e" />

#### 5. 
```
pip install
```

#### 6. 
```
uvicorn main:app --reload
```
(make sure that the right interpreter is selected)

#### 7. 
go to http://127.0.0.1:8000/ and u should see somethin

#### 8. 
to deactivate virtual environment (venv) run ```deactivate```


