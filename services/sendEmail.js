import nodeoutlook from 'nodejs-nodemailer-outlook'

export default function sendConfirmationEmail(email,message){
    nodeoutlook.sendEmail({
        auth:{
            user: "sarahaserver@outlook.com",
            pass: "rvyG_Nea8kXuH_G"
        },
        from: 'sarahaserver@outlook.com',
        to: email,
        subject: 'Welcome !',
        html: message,
        text: 'This is text version!',
    
        onError: (e) => console.log(e),
    })
}

