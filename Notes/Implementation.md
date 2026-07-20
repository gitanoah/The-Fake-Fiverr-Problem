- In order to account for all of the different factors that can identify a phishing site I wanted to follow the practices of "defense in depth" and developed the idea from my friend of using a "risk score"
- When a user is redirected from the home page of a site or is prompted to input card data the risk score will be displayed if it is over 55 percent or if the user wants to check it through the extension.

## Brands
- I felt it would be easier to lay out all of my trusted brands or brands that were more vulnerable to phishing sites.
- I initialized my `riskWeight = 0` until I was able to do more research and testing
- I decided logically, since money was a more important asset in terms of online market places and e-commerce to make the risk score of the brands that were related to payment and crypto higher to reflect the emphasis on protecting the money of the user.
## Risk Score
- My **Risk Score** will be split up into different categories for defense in depth:
	
	- **Domain Name**
		- Hostname and Destination Mismatch
		- Look for popular online marketplace names in body and header texts and compare to domain names
		- Mismatches can indicate brand impersonations for example the "fiverr-payment-verify.top" would strongly indicate an attempted impersonation.
		- Flag domain names that are IPs instead of actually site names
		- And urgently flag domains in http since they are less secure especially if they request sensitive information
		- 
	- **Domain Extensions**
		- From https://www.ubilibet.com/en/the-most-commonly-used-domain-extensions-for-fraud-in-2025/ & https://www.gomyitguy.com/blog-news-updates/malicious-domain-extensions I got: `.com, .top, .xyz, .xin, .shop, .cfd, and .lol, .cf, .ml, .ga, .work, .gq, .fit, .tk`
		- So I instead increased risk score for extra risky domains (all excluding `.com`) and increased risk score a small amount if it did not match commonly secure domains: `.gov, .edu, and .mil`
	- **Requests for Sensitive Information**
		- Want to check for when the page asks for sensitive data like card information if the brand name is present in the title or text
		- (Can hurt because an article can be flagged for mentioning brand like paypal)
	- **Malicious Phrases**
		- Cap on amount that can be found so risk score isn't overflowed by the amount of potential malicious phrases (2 for now).
		- 
	- **Requests to Other/Suspicious Domains**
		- Need to implement

	- **Unknown Provider Requests**
		- If the page asks for sensitive data we can check for <\input> elements.
		- Things like autocomplete = "cc-number"

## Popup
- Uses DOM APIs instead of inner HTML to prevent issues such as cross scripting
