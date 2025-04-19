# 🛟 [Lifeguard Vision](https://lifeguard-vision.vercel.app/)
A web app leveraging artificial intelligence to assist lifeguards in rapidly identifying potential drowning incidents and alerting emergency services before the situation escalates.  

Built by Michael Wu (Lead), Jayden Nguyen (Backend), Brandon Tseng (Frontend), and Timothy Huang (Frontend) for the BroncoHacks 2025 24-Hour Hackathon.

Demo Video: https://youtu.be/mfYDPStKLiI. 
## 🖼️ Preview
<img width="1551" alt="Landing Page" src="https://github.com/user-attachments/assets/6cd1be3b-d4c1-41fe-8a69-92cbeb194185" />

<img width="1564" alt="Camera View" src="https://github.com/user-attachments/assets/527e868a-c106-4be8-884c-2903ecafc3ae" />

## 🔧 Dev Environment Setup
### Frontend
1. Navigate to the frontend directory
```
cd frontend
```
2. Install node_modules
```
npm install
```
3. Run the dev environment
```
npm run dev
```
### Backend
1. Navigate to the backend directory
```
cd backend
```
2. Create a Virtual Environment

May need to use python3 depending on what version you have.
<details><summary>macOS/Linux</summary>
  
```
python -m venv venv
source venv/bin/activate
```
</details>
<details><summary>Windows (PowerShell)</summary>
  
```
python -m venv venv
.\venv\Scripts\Activate.ps1
```
</details>

3. Run the backend
```
uvicorn main:app --reload
```

4. If you need to exit the VENV
```
deactivate
```
