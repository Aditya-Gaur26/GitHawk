let email = document.querySelector('.email-input');
let username = document.querySelector('.username-input');

let btn = document.querySelector('.btn-switch')

let otp_div=  document.querySelector('.otp-input'); ;

btn.addEventListener('click',()=>{
    username.classList.add('hidden');
    email.classList.remove('hidden');
    document.querySelector(".forgot_your_username").classList.add('hidden');
})

document.querySelector("#hide-password1").addEventListener("click",(ev)=>{
    let eye = ev.target;
    let password = eye.previousElementSibling;
    if (password.type === 'password') {
        password.type = 'text';
        eye.classList.remove('fa-eye-slash');
        eye.classList.add('fa-eye'); 
    } else {
        password.type = 'password';
        eye.classList.remove('fa-eye');
        eye.classList.add('fa-eye-slash');
    }

})

document.querySelector("#hide-password2").addEventListener("click",(ev)=>{
    let eye = ev.target;
    let password = eye.previousElementSibling;
    if (password.type === 'password') {
        password.type = 'text';
        eye.classList.remove('fa-eye-slash');
        eye.classList.add('fa-eye'); 
    } else {
        password.type = 'password';
        eye.classList.remove('fa-eye');
        eye.classList.add('fa-eye-slash');
    }
    
})
let username_outer_div  = username;
let email_outer_div = email;
let forgot_user;

let send_otp = document.querySelector("#send-otp");

send_otp.addEventListener("click",async (ev)=>{
    let username = document.querySelector("#username");
    let email = document.querySelector("#email");
    if(!username_outer_div.classList.contains("hidden")){
        console.log(1);
        let user = username.value;
        username.value="";
        if(user.trim() == "") {
            alert("please enter a valid username");
            return;
        }
        let {data} = await axios.post("/get_user_from_username",{
            username:user
        })
        console.log(data);
        if(data == ""){
            alert("user not found");
            return;
        }
        forgot_user = data;
        let mail = data.email;

        await axios.post("/send_otp",{
            email:mail
        })

        $(username_outer_div).addClass("hidden");
        $(email_outer_div).addClass("hidden");
        $(otp_div).removeClass("hidden");
        $("#send-otp").addClass("hidden");
        $("#check-otp").removeClass("hidden");
        $(".Resend_otp").removeClass("hidden");
        $(".forgot_your_username").addClass("hidden");

    }
    else{
        console.log(2);
        let em = email.value;
        email.value = "";
        if(em.trim()==""){
            alert("please enter a valid email");
            return;
        }
        let {data} = await axios.post("/get_user_from_email",{
            email:em
        })
        console.log(data);
        if(data == ""){
            alert("user not found");
            return;
        }
        forgot_user = data;
        let mail = data.email;
        await axios.post("/send_otp",{
            email:mail
        })

        $(username_outer_div).addClass("hidden");
        $(email_outer_div).addClass("hidden");
        $("#send-otp").addClass("hidden");
        $(otp_div).removeClass("hidden");
        $("#check-otp").removeClass("hidden");
        $(".Resend_otp").removeClass("hidden");
    }
})
let otp;
$("#check-otp")[0].addEventListener("click",async (ev)=>{
    otp = $("#otp").val();
    let result = await axios.post('/check_otp',{
        otp
    })
    if(!result){
        alert("entered otp is wrong");
        return;
    }
    $(otp_div).addClass("hidden");
    $("#check-otp").addClass("hidden");
    $(".Resend_otp").addClass("hidden");
    $(".password-input").removeClass("hidden");
    $(".cpassword-input").removeClass("hidden");
    $("#change-password").removeClass("hidden");
})

$("#change-password")[0].addEventListener("click",async (ev)=>{
    let pass = $("#password").val();
    let cpass = $("#cpassword").val();
    if(pass == "" || cpass == ""){
        alert("Please fill both the fields.")
        return;
    }
    if(pass!= cpass){   
        alert("Password and Confirm Password must be same.")
        return;
    }

    let result = await axios.post("/change_password",{
        otp,
        password:pass,
        forgot_user
    })
    
    window.location.href = '/login';
})