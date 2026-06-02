
**(First I want to test some of my assumptions: )**

**Phishing Site:**
## Assumption 1:
- For the first assumption " If you type in your actual username the phishing site extracts the data from your gig to display on the screen." I want to compare the display I got with my username vs inputting another gigs username
- Mine:
![[Fiverr3img.png]]
- Then I found another public gig:
![[Screenshot 2026-05-14 at 5.06.49 PM.png]]
![[Screenshot 2026-05-14 at 5.06.37 PM.png]]
- Then I put their username in the human verification box:
![[Screenshot 2026-05-14 at 5.08.13 PM.png]]
- This confirms the assumption that the phishing site extracts the users data from their publicly displayed gig, things such as their gig price, photo, and their profile photo on the top right.
- Additionally when I inspected the site I saw the fetch() command being used, which is also evidence of the site gathering data from another site, which in this case is the img from the Fiverr URL of the seller ![[Screenshot 2026-05-14 at 5.19.29 PM.png]]
## Assumption 2:
- For the second assumption "  All links on the phishing site redirect the user to the real Fiverr site" I just inspected the page and saw that the header and footer contained links to corresponding the Fiverr.com site![[Screenshot 2026-05-14 at 5.19.34 PM.png|674]]
- This assumption was also correct, because the corresponding official Fiverr use more of a relative path approach to their header and footer links which dont include `www.Fiverr/`...
![[Screenshot 2026-05-18 at 3.55.27 PM.png]]
## Assumption 3:
- For the third assumption " The phishing site sends the user card input to an external user/server and the user can never actually be verified" I want to input false card information and see how the site reacts
- I input the card number "1234 5678 9101 11213" and the expiration and CVV "05/30" and "1234" then I got the screen:
![[Screenshot 2026-05-14 at 5.14.36 PM.png]]

- Which I'm assuming is another attempt at getting enough information to steal money from the user's account, after you input any amount of currency you get this screen: ![[Screenshot 2026-05-14 at 5.15.25 PM.png]]
- So I then searched for "`POST`" while inspecting the page again, since I learned from my previous project that `POST=` is an HTTP method that uses a URL to decide where data is sent however I could not find anything suspicious besides the already altered website URL (`https://first-gig.top/f...`) 
- I tried to open DevTools specifically the `Network` tab and see if I could find any alerting 
## More
- I decided it may be of use to use **Burpsuite** instead of looking through the overwhelming amount of traffic traffic by becoming the middle man between my browser and the server the information may be being sent to. (I researched the tool for a couple of days and came to the conclusion it would fit me more to just rely on the dev tools through the browser for the sake easier use and safety.)
- ![[IMG_8241.png]]
- ![[IMG_8242.png]]
- A final note is during my BurpSuite inspection I encountered an error when trying to connect via BurpSuite and I tested the connection to the web server using `curl -vk` (normal and with proxy) and `openssl s_client`.
- ![[IMG_8243.png]]
- ![[IMG_8240.png]]
- With the site not working in Burp Browser and the TLS handshake only reading 5 bytes before it stopped I also wanted to make the assumption that the phishing site was actively blocking proxy or interception connections.
- Looking into it more it gave the IP `104.21.77.125` is a part of Cloudflare's network, which means this IP is shared by thousands of websites.
- This explains Burp not being able to connect since I was connecting to Cloudflare and not the actual site, which can suggest defense against proxy connections.

- Back to the Dev Tools when I submitted fake data in the site I saw a `submitCardCurrency` file trigger along with event listeners that run this process, (I also saw the server was Cloudflare which confirmed the IP findings earlier) this gives me enough evidence to assume that the card data is being collected from the phishing site and being sent somewhere else hidden by the anti-proxy part of Cloudflare.
- ![[824ACB5B-9995-4D30-9CCC-DA01549704D1_4_5005_c.jpeg]]
## Solution
- In order to account for all of the different factors that can identify a phishing site I wanted to follow the practices of "defense in depth" and developed the idea from my friend of using a "risk score"
- When a user is redirected from the home page of a site or is prompted to input card data the risk score will be displayed if it is over 55 percent or if the user wants to check it through the extension.
