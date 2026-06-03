
**(First I want to test some of my assumptions: )**

**Phishing Site:**
## Assumption 1:
- For the first assumption " If you type in your actual username the phishing site extracts the data from your gig to display on the screen." I want to compare the display I got with my username vs inputting another gigs username
- Mine:
<img width="1512" height="827" alt="Fiverr3img" src="https://github.com/user-attachments/assets/d2cbe953-c398-4bd9-9940-9531cf3e2004" />

- Then I found another public gig:
<img width="1512" height="827" alt="Fiverr6img" src="https://github.com/user-attachments/assets/5911b387-060c-49ea-816c-69360e194079" />
<img width="1512" height="827" alt="Fiverr7img" src="https://github.com/user-attachments/assets/f2999405-608a-43ec-8f6c-7fc31929299d" />
- Then I put their username in the human verification box:
<img width="1512" height="827" alt="Fiverr8img" src="https://github.com/user-attachments/assets/e82b19a5-7710-4728-ba81-0838159ae1af" />

- This confirms the assumption that the phishing site extracts the users data from their publicly displayed gig, things such as their gig price, photo, and their profile photo on the top right.
- Additionally when I inspected the site I saw the fetch() command being used, which is also evidence of the site gathering data from another site, which in this case is the img from the Fiverr URL of the seller
<img width="1512" height="827" alt="fetch()fiverrimg" src="https://github.com/user-attachments/assets/e65e7129-8bf0-4a25-bec9-cba53bf77831" />

## Assumption 2:
- For the second assumption "  All links on the phishing site redirect the user to the real Fiverr site" I just inspected the page and saw that the header and footer contained links to corresponding the Fiverr.com site!
<img width="1512" height="827" alt="redirectlinksfiverrimg" src="https://github.com/user-attachments/assets/58602cf6-6cc0-4619-af4f-54858d5431c5" />

- This assumption was also correct, because the corresponding official Fiverr use more of a relative path approach to their header and footer links, not including  `www.Fiverr/`...
<img width="1512" height="827" alt="relativefiverrlinksimg" src="https://github.com/user-attachments/assets/e311b366-2d91-40fb-9759-f213c9e380d6" />

## Assumption 3:
- For the third assumption " The phishing site sends the user card input to an external user/server and the user can never actually be verified" I want to input false card information and see how the site reacts
- I input the card number "1234 5678 9101 11213" and the expiration and CVV "05/30" and "1234" then I got the screen:
<img width="1512" height="827" alt="cardverificationphishingsite" src="https://github.com/user-attachments/assets/8ebbfa53-8a6e-498e-8d53-9704772679dd" />

- Which I'm assuming is another attempt at getting enough information to steal money from the user's account, after you input any amount of currency you get this screen:
<img width="1512" height="827" alt="paymenyverifyphishingimg2" src="https://github.com/user-attachments/assets/90bd187c-266b-479d-bf86-f3e3943132be" />

- So I then searched for "`POST`" while inspecting the page again, since I learned from my previous project that `POST` is an HTTP method that sends data to an endpoint specified by a URL, however I could not find anything suspicious besides the already altered website URL (`https://first-gig.top/f...`) 
- I tried to open DevTools specifically the `Network` tab and see if I could find any alerting 
## More
- I decided it may be of use to use **Burpsuite** instead of looking through the overwhelming amount of traffic traffic by becoming the middle man between my browser and the server the information may be being sent to. (I researched the tool for a couple of days and came to the conclusion it would fit me more to just rely on the dev tools through the browser for the sake easier use and safety.)
<img width="5712" height="4284" alt="IMG_8241" src="https://github.com/user-attachments/assets/56fda623-49db-40e8-9afd-832fe433ecdc" />

<img width="5712" height="4284" alt="IMG_8242" src="https://github.com/user-attachments/assets/4804424c-24d4-4889-b52c-26b644606a3c" />

- A final note is during my BurpSuite inspection I encountered an error when trying to connect via BurpSuite and I tested the connection to the web server using `curl -vk` (normal and with proxy) and `openssl s_client`.

<img width="3024" height="4032" alt="IMG_8243" src="https://github.com/user-attachments/assets/20304409-f3a5-4d6d-bb68-46b179cee82b" />

<img width="4032" height="3024" alt="IMG_8240" src="https://github.com/user-attachments/assets/5954763c-98a8-4fe4-82f0-264a1f951836" />

- With the site not working in Burp Browser and the TLS handshake only reading 5 bytes before it stopped I also wanted to make the assumption that the phishing site was actively blocking proxy or interception connections.
- Looking into it more it gave the IP `104.21.77.125` is a part of Cloudflare's network, which means this IP is shared by thousands of websites.
- This explains Burp not being able to connect since I was connecting to Cloudflare and not the actual site, which can suggest defense against proxy connections.

- Back to the Dev Tools when I submitted fake data in the site I saw a `submitCardCurrency` file trigger along with event listeners that run this process, (I also saw the server was Cloudflare which confirmed the IP findings earlier) this gives me enough evidence to assume that the card data is being collected from the phishing site and being sent somewhere else hidden by the anti-proxy part of Cloudflare.
<img width="5712" height="4284" alt="IMG_8245" src="https://github.com/user-attachments/assets/670e50ff-dc3e-4f01-97a4-cb68922af41f" />

## Solution
- In order to account for all of the different factors that can identify a phishing site I wanted to follow the practices of "defense in depth" and developed the idea from my friend of using a "risk score"
- When a user is redirected from the home page of a site or is prompted to input card data the risk score will be displayed if it is over 55 percent or if the user wants to check it through the extension.
