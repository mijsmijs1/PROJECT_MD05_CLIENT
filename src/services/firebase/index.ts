import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, deleteUser, reauthenticateWithCredential } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAjmF4Sof6BiU6SP-c0yIPqaGPuHrSFYnk",
    authDomain: "project-md2-d00b4.firebaseapp.com",
    projectId: "project-md2-d00b4",
    storageBucket: "project-md2-d00b4.appspot.com",
    messagingSenderId: "411716503991",
    appId: "1:411716503991:web:44f890438bb9e3b2528032",
    measurementId: "G-X5B3VYT8WG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = auth.currentUser;


export async function uploadToFirebase(file, fallBackUrl) {
    try {

        const tailFile = file.name.split('.')[file.name.split('.').length - 1]
        const storage = getStorage(app);
        const mountainsRef = ref(storage, `image_${Date.now() * Math.random()}.${tailFile}`);

        let res = await uploadBytes(mountainsRef, file)
        let url = await getDownloadURL(res.ref)
        return url
    } catch (err) {
        console.log('err', err);
        return fallBackUrl
    }
}

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    try {
        let result = await signInWithPopup(auth, provider);
        return result;
    } catch (err) {
        return false
    }
}


export async function loginWithGithub() {
    const provider = new GithubAuthProvider();
    const auth = getAuth(app);
    try {
        let result = await signInWithPopup(auth, provider);
        return result;
    }
    catch (err) {
        return false
    }
}

export async function reauthenticate() {
    // Đây là một dòng mã trong đó chúng ta gán giá trị trả về từ hàm promptForCredentials() 
    //vào biến credential. Hàm promptForCredentials()là một hàm để hiển 
    //thị giao diện người dùng và lấy thông tin xác thực từ họ. Ví dụ, hàm này có thể sử dụng prompt() 
    //hoặc các thư viện UI để hiển thị một hộp thoại cho người dùng nhập thông tin xác thực như tên người
    // dùng và mật khẩu.
    const credential = promptForCredentials();
    //gọi hàm reauthenticateWithCredential() để xác thực lại người dùng với chứng chỉ 
    //(credential) đã nhập.
    reauthenticateWithCredential(user, credential)
        .then(() => {
            // lúc này đã call api thành công và xác thực cho tất cả các tài khoản nằm trong phần users của
            //authentication của firebase
        }).catch((error) => {
            //lỗi
        });
}

export async function logout() {
    //Phương thức onAuthStateChanged lắng nghe sự thay đổi trong trạng thái xác thực của người dùng. 
    //Khi trạng thái xác thực thay đổi, một hàm callback được gọi và truyền đối tượng user đại diện cho 
    //người dùng hiện tại. Hàm callback này sẽ được thực thi mỗi khi có sự thay đổi trong trạng thái xác 
    //thực của người dùng.
    auth.onAuthStateChanged((user) => {
        if (user) {
            deleteUser(user)
                .then(() => {
                    // xóa thành công
                })
                .catch((error) => {
                    console.log('error', error);
                });
        } else {
            console.log('No user is currently authenticated.');
        }
    });
}