const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1830637360:AAE-w0HfwfvWma5C9XHsX_aoPX22dVlrirY';

let PincodeMessage="";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
 bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
console.log(chatId);
  // send a message to the chat acknowledging receipt of their message

  //let welcome= await SetMessage(msg)

 // let sentMessage=(welcome.length>1?welcome:"No Slot Available")
  //bot.sendMessage(chatId, welcome);
  // axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=@malluactressfc&text=${welcome}`).then((data)=>{
  //   console.log(data);
  // })

  
  if(!!msg.photo && msg.photo.length>0)
  {
    let imageData=msg.photo[msg.photo.length-1];

    bot.sendPhoto("-1001480743030",imageData.file_id)

  //    axios.get(`https://api.telegram.org/bot${token}/sendPhoto?chat_id=@malluactressfc&photo=${imageData.file_id}`).then((data)=>{
  //   console.log(data.data);
  // })
  }
  else
  {
    bot.sendMessage(chatId, "Please Send A Image File")
  }

  
  
});


async function  SetMessage(msg)
{
    return new Promise(async (resolve)=>{

        if(msg.text.toString().toLowerCase()=="/start" || msg.text.toString().toLowerCase()=="start")
        {
            let welcome="Hi "+msg.chat.first_name;
           // return welcome+" Please Enter Your Pincode";
            resolve(welcome+" Please Enter Your Pincode")
        }
        else if (validatePincode(msg.text))
        {
           let data =await GetSlotChecking(msg.text)
            resolve(PincodeMessage)
        }
        else
        {
           
            resolve("Please Enter Valid Pincode")
        }

    })

   
}

function validatePincode (pin) {
    return /^(\d{4}|\d{6})$/.test(pin);
}

async function GetSlotChecking(pincode)
{
  PincodeMessage="No Slot Available";
return new Promise(async (resolve)=>{
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    var dd = tomorrow.getDate();
    var mm = tomorrow.getMonth() + 1;
    var yyyy = tomorrow.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var date = dd + '-' + mm + '-' + yyyy;
    let BASEURL='https://cdn-api.co-vin.in/api'
    axios.get(BASEURL+'/v2/appointment/sessions/public/calendarByPin?pincode='+pincode+'&date='+date)
      .then(response => {
      //  console.log(response.data);
        if(response)
        {
          if(response&&response.data)
          {
           
            if(!response.data['centers'].length)
            {
             
              resolve("No Slot Available");
          
            }
            else
            {
             
              if(response.data['centers'].length>0)
              {
              
                PincodeMessage="";
               for (const result of response.data['centers']) {
                let sessions=result['sessions'];
             
                for (const sess of sessions) {
                  //let cost=(sess.fee==0?"Free":sess.fee);
                  PincodeMessage+=sess.date+"\nCenter :"+result.name+'\n'+"Address : "+result.address+'\n'+'District :'+result.district_name+'\n'+"Vaccine :"+sess.vaccine+'\n'+"Cost :"+result.fee_type+'\n'+"Total "+sess.available_capacity+" Slots are Available on "+sess.date+"\n First Doss :"+sess.available_capacity_dose1+"\n Second Doss : "+sess.available_capacity_dose2+'\n\n';
                 
                }
               
               }

              //   let result=response.data['sessions'][0];
              //  let cost=(result.fee==0?"Free":result.fee);
              //  PincodeMessage="Center :"+result.name+'\n'+"Address : "+result.address+'\n'+'District :'+result.district_name+'\n'+"Vaccine :"+result.vaccine+'\n'+"Cost :"+cost+'\n'+"Total "+result.available_capacity+" Slots are Available on "+result.date+'\n';
              //  console.log(result);
               if(PincodeMessage.length>10)
               {
                resolve(PincodeMessage);
               }
               else
               {
                resolve("No Slot Available");
               }
              
              }
              else
              {
               resolve("No Slot Available"); 
              }
            }
            
            resolve("No Slot Available");
          }
          else
          {
           resolve("No Slot Available");
          }
        }
        else
        {
         resolve("No Slot Available");
        }
      

       
    
      })
      .catch(error => {
        console.log(error);
        resolve("No Slot Available");
      });
})    


}