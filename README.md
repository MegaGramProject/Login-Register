# Login-Register
  This GitHub repository contains code that powers both the <b>frontend & backend</b> of <b>logging in and registering users</b> into <b>Megagram</b>. Megagram is a blend of some of the features of <b>Instagram and Amazon</b>, combined into a single website. It was created by me, <b>Rishav Ray</b>, as a personal project to <b>acquire and then showcase</b> my skills. To <b>allocate my time efficiently</b>, I focused on <b>three of the nine key repositories</b> of Megagram —<b>Login-Register, Reset-Password, and Home-Page</b>— which when combined <b>fulfills</b> my <b>purpose</b> of the <b>entire endeavor</b>. I also focused on the <a href="https://github.com/rishavry/WorksPresentation" style="font-weight: bold;" target="_blank" rel="noopener noreferrer">WorksPresentation Github repository</a> of mine(which has a <b>wiki with important info</b>), containing a complex frontend that acts as a <b>website about me for job-recruiters and employers to view</b>!

  <b>Welcome</b> aboard!

## Table of Contents
  0. [Important Disclaimer](#important-disclaimer-because-honesty-is-the-best-policy)
  1. [Key Points on Frontend](#key-points-on-frontend)
  2. [Key Points on Backend](#key-points-on-backend)
  3. [Key Points on Data](#key-points-on-data)
  4. [Key Points on Cloud](#key-points-on-cloud)
  5. [Video-Demonstration of Frontend](#video-demonstration-of-frontend)
  6. [Finale(My Contact Info is Here)](#finale)

## Important Disclaimer because Honesty is the Best Policy

During the first iteration of Project Megagram, I worked on all nine repositories. In the second iteration, I narrowed my focus to three of them, including this Login-Register repository. In the third and final iteration, I continued concentrating on these three repositories. However, I chose not to fully revise and polish all the frontend and backend files across them, as the work(which I was not paid at all for) felt repetitive and offered limited new learning and 'showing-skills-to-future-employer' opportunities. Furthermore, all the cloud-services that my project so heavily relies on were out of my budget.

To combat the issues above, I used the final iteration to create detailed wiki pages in my <a href="https://github.com/rishavry/WorksPresentation" style="font-weight: bold;" target="_blank" rel="noopener noreferrer">WorksPresentation Github repository</a>. These documents outline how I would approach various aspects of frontend, backend, cloud architecture, and more, if I were tasked with building them under real-world conditions.

As a result, the current state of the content in this repository(including the rest of the README below) may not fully reflect industry-grade optimization or deployment readiness. Rather, it represents earlier work, with my more refined thought process and technical strategies documented in the associated wiki pages.

## Key Points on Frontend
  * The frontend is powered by <b>Python Django</b> and is located in the <b>login_register_frontend</b> directory in this Github repo.

  * Inside login_register_frontend will be my_app, which contains the static folder and the templates folder necessary for this project. Templates are written in <b>HTML, and static includes JavaScript-files, CSS-files, an images folder,
  and a fonts folder</b>. 

  * There are <b>4 endpoints</b>: /login, /register, /age-check, and /confirm-code. All the endpoints start with https://project-megagram.com/login-register/. 

  * Each of the frontend pages work for both <b>dark-mode and light-mode of the system</b>, and have been <b>successfully tested</b> across the <b>top 5 most popular browsers</b> and across the <b>different screen-sizes</b> provided by Google-Chrome Dev-Tools.

  * The JavaScript utilizes <b>JQuery</b> to a significant extent due to its <b>concise syntax and grand popularity</b> in the world of web-frontends.

  * The frontend utilizes <b>Google-Cloud for its reCaptcha and OAuth services</b>. Specifically, it utilizes
  reCaptcha to verify that <b>user-login-attempts aren't done by a robot</b>. The OAuth services give users
  the ability to <b>create accounts</b> and <b>login</b> to Megagram <b>via their Google accounts. Disclaimer:</b> these <b>weren't actually implemented</b> by me due to <b>financial constraints</b>, however, I <b>detailed</b> out <b>exactly how I would've</b> done them in the <b>wiki</b>!

  * You can append <b>?language=Italiano or ?language=日本語</b> to the URL to trigger backend calls for <b>translations via a language-translation API</b>. For translations that are already cached in Redis, the backend directly returns that instead of spending money and API-usage-tokens on the RapidAPI DeepTranslate API Service. 

  * Whenever the user tries to access an endpoint in the frontend that <b>does not exist</b>, they will come across a <b>'Page-Not-Found'</b> page that is very well styled. It was created by an <b>impeccable Graphics designer</b> and the styling is <b>very exquisite and complex</b>, but I was able to <b>alter</b> the HTML/JS/CSS just a bit so that it <b>fits the 'Megagram' brand</b>.

## Key Points on Backend
  * The backend is powered by <b>Python Django</b> and is located in the <b>login_register_backend</b> directory in this Github repo. It supports the methods <b>'GET', 'POST', 'PATCH', & 'DELETE'</b>.

  * There are <b>14 endpoints</b>, presented in the screenshot below. All the endpoints start with https://project-megagram.com/api/login-register/. 
  
  <img src="./README_imgs/all14BackendEndpoints.png">

  * The backend utilizes <b>rate-limiting on each one of its endpoints</b>(and the rates <b>can vary</b> per endpoint). For instance, some endpoints(specifically /updateUser, /removeUser, and /loginUser) have rate-limits <b>much lower</b> than the other endpoints for the <b>sake of security- 5 per hour</b> based on ip-address and user-id. This is because the <b>/updateUser and /removeUser endpoints both require user-auth-tokens</b> and keeping the limit low makes brute-force-attacks much less likely to work. Similarly, For <b>/loginUser, users need to send in the correct password</b>, and keeping the limit low significantly hinders brute-force-attacks. 

  * For the usersTable, the backend uses a <b>Django model(User) and serializer(UserSerializer)</b>. For accessing the userAuthTokens table it uses a <b>google-cloud-mysql-spanner client</b>. For accessing the <b>'Usernames and their Info'</b> Redis hashset, it uses the <b>Redis-connection that was configured in settings.py</b> as the default(which is also used by Django for rate-limiting).

  * The <b>/updateUser, and /removeUser</b> endpoints both <b>require user-auth-tokens</b> to proceed. The <b>/createUser</b> endpoint provides the newly-created user the user-auth-tokens to proceed(i.e it <b>creates the account and logs in</b> the user on their browser). The <b>/loginUser</b> endpoint enables the user to log in by refreshing their userAuthToken and userRefreshToken and setting their HTTP-only, same-site-strict cookies; logins only work if the provided password by the user to the endpoint is correct.

  * For <b>encrypting/decrypting user-data</b>(specifically the '<b>contactInfo</b>' for all users, and the '<b>accountBasedIn</b>' and '<b>dateOfBirth</b>' for users with isPrivate set to True), the backend uses <b>Google-Cloud Key-Management-Service</b>. Specifically, it uses a global key-ring called '<b>usersTableMySQL</b>'; each row in the 'users' Table corresponds to an id(which is an integer representing the user-id), and the <b>stringified id is used as the key-id for encrypting and decrypting the specific columns of each user-row</b>.

  * There are <b>18 helper methods</b> in the backend that are not directly accessible via the Rest API but are used by the methods that are accessible via the Rest API. For the sake of organization of views.py, <b>first all the Rest API methods are listed</b> and <b>then all the helper-methods</b>. Below is a screenshot of the <b>names and parameters of all 18 helper-methods</b>.
  <img src="./README_imgs/all16BackendHelperMethods.png">

## Key Points on Data
  * For this repository, there's one <b>locally-hosted MySQL table called 'users'</b>; one MySQL table hosted via <b>Google Cloud MySQL-Spanner called 'userAuthTokens'</b>; there's also an <b>AWS-Redis cache for three purposes in this website</b>. More on that later in this section. 

  * You can connect to the <b>Locally-hosted MySQL Database with read-only-access</b> via the following details: host: 'ngrok(update this later)', username: 'spectator', password: ''(no password). You can also connect to the <b>AWS-Redis Cache with read-only-access</b> using host: 'redis-14251.c261.us-east-1-4.ec2.redns.redis-cloud.com:14251', username: 'spectator', & password: 'SPECtator1!!'.

  * The <b>'users' table</b> has fields that can be described in the screenshot below. Users must be <b>at-least 10 years of age</b> and the accountBasedIn field must be either <b>a US-State, a country, or 'N/A'/'Temporary'</b>. The password must pass a <b>strength test</b> and is only stored in the database after salting and hashing it(i.e user passwords are <b>not stored as plaintext</b>). 
  <img src="./README_imgs/userModel.png">

  * The 'userAuthTokens' table has the following fields: <b>hashedAuthToken(45-character-string), authTokenSalt(45-character-string), hashedRefreshToken(45-character-string), hashedRefreshTokenSalt, authTokenExpiry(timestamp), and refreshTokenExpiry(timestamp)</b>. Auth tokens(last 45 min) are used in cookies and backend-servers to <b>prove authentication</b> required for certain requests(<b>i.e updating/deleting an account</b>), and refresh-tokens(last 7 days and also used in cookies) are used to <b>refresh auth-tokens that have expired</b>. Once both the refresh token and auth token are expired, the user needs to re-login.
  
  * The <b>three purposes of AWS-Redis for Login-Register are as follows</b>: (1) For <b>rate-limiting</b> all the different endpoints of the backend. (2) For using hash-sets named something like <b>'Translations from English to Español'</b> which stores key-value pairs
  where keys are English words and values are their Spanish translations. This is used by the frontend for translating the website; this hash-set <b>aids in efficiency and reducing money/usage-tokens spent</b> when making requests to the Rapid-API Deep-Translate API service. (3) For using the hash-set <b>'Usernames and their Info'</b> which contains keys that are usernames of Megagram-users and values that are stringified dicts that contain their info(i.e all the other fields of the user in the 'users' table). This hash-set enables <b>efficiency in fetching user-info</b>.

## Key Points on Cloud
  * For the Login-Register part of Megagram, the only cloud-service-provider used is <b>GCP(Google Cloud Platform)</b>.

  * Disclaimer:</b> anything cloud-related <b>wasn't actually implemented</b> by me due to <b>financial constraints</b>, however, I <b>detailed</b> out <b>exactly how I would've</b> done them in the <b>wiki</b>!

  * GCP is used by the frontend for <b>reCaptcha and OAuth</b>, and by the backend for <b>encrypting/decrypting sensitive columns</b> of the 'users' table with the help of Google-Cloud <b>Key-Management-Service</b>(and the keys are all <b>rotated automatically every 70 days</b>). 

  * GCP is used for the <b>GKE(Google-Kubernetes-Engine) Cluster</b>, where the <b>auto-scaling and loadbalancing of Kubernetes pods</b> for both the frontend and backend <b>takes place</b>. You can find the actual Docker repositories in Docker Hub under <b>rishavry/login-register-backend and rishavry/login-register-frontend</b>.

  * Last, but not least, GCP is used for the <b>Managed Instance Group(MIG) called 'megagram-server-group'</b>. This MIG has <b>auto-scaling enabled</b> and each instance in this group has a <b>startup-script(located in this repo as megagram-server-startup.sh)</b> that uses nginx to handle traffic at port 443. The nginx routes requests with <b>/login-register/ and /login-register-api/ to the load-balancers in the GKE Cluster</b> mentioned in the earlier point. the This MIG has a load-balancer that maps to port 443 of each instance in the MIG, and the ip-address of this load-balancer is the one that is <b>directly associated</b> with https://megagram.com!

## Video-Demonstration of Frontend
  Right <a href="https://the-works-of-rishav-ray.com/videos/LoginRegisterFrontendDemonstration.mov" target="_blank" rel="noopener noreferrer">here</a>.

## Finale
  Thank you for sticking around till the end! Hope you found what you were looking for. Whether you did or did not, feel free to reach out to me using any of the following methods:

  * Email: rishavray422@gmail.com

  * Number(texting only): <span style="color:#03b6fc">608-443-7805</span>

  * Linkedin: https://www.fakelink.com
