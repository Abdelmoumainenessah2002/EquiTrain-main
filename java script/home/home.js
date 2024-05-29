const userData = JSON.parse(localStorage.getItem('userData'));
const photoProfileUrl = userData.photoProfileUrl;

const profileImg = document.querySelector('.profile-img');
profileImg.style.backgroundImage = `url(${photoProfileUrl})`;




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCTbx45h8JxTxiWjffageMGdhuj47vQEcQ",
    authDomain: "equitrain-75d79.firebaseapp.com",
    projectId: "equitrain-75d79",
    storageBucket: "equitrain-75d79.appspot.com",
    messagingSenderId: "888486571768",
    appId: "1:888486571768:web:bb582c7420c4cdf2eb150d",
    measurementId: "G-22M8Z4XHT9"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);



document.querySelector('.search-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchType = document.getElementById('search-type').value;
    const inputValue = document.getElementById('search-input').value;
    const userInfoDiv = document.querySelector('.user-info');
    const userPhoto = document.getElementById('user-photo');
    const userNameDisplay = document.getElementById('user-name');
    const userProfileLink = document.querySelector('.visit');

    try {
        if (searchType === 'Uid') {
            const userDocRef = doc(firestore, 'users', inputValue);
            const querySnapshot = await getDoc(userDocRef);
            if (querySnapshot.exists()) {
                displayUserInfo(querySnapshot,inputValue );
            } else {
                alert("No user found with the given UID.");
            }
        } else {
            const usersRef = collection(firestore, 'users');
            const queryRef = query(usersRef, where("name", "==", inputValue));
            const querySnapshot = await getDocs(queryRef);
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    
                    displayUserInfo(doc, doc.id);                   
                });
            } else {
                alert("No user found with the given name.");
            }
        }
    } catch (error) {
        console.error("Error in user search:", error);
        alert("Error occurred while searching for user.");
    }

    function displayUserInfo(userDoc, id) {
        const userData = userDoc.data();
        userPhoto.src = userData.photoProfileUrl || 'default-image-path.jpg'; // Replace with your default image path
        userNameDisplay.textContent = userData.name;
        userInfoDiv.style.display = 'block';
        userProfileLink.href = `userProfile.html?uid=${id}`; // Assuming `uid` is the field name for UID in your Firestore data
    }
});







const uid = userData.uid;
const userDocRef = doc(firestore, 'users', uid);
const querySnapshot = await getDoc(userDocRef);
if (querySnapshot.exists()) {
    const userDataFromFireBase = querySnapshot.data();
    
    const currentDate = new Date();
    const endDate = new Date(userDataFromFireBase.endDate.seconds * 1000); 
    
    if (endDate < currentDate) { 
        
        userDataFromFireBase.isActive = false;
        await setDoc(userDocRef, userDataFromFireBase);
        localStorage.setItem('userData', JSON.stringify(userDataFromFireBase));
        alert("Your account has been deactivated, please recharge your account to keep using our services.");
        localStorage.clear();
        setTimeout(()=>{
            window.location = "../login & signup/login.html"
        } , 1500);
    }
} else {
    alert("No user found with the given UID.");
}


