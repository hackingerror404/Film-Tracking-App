# Film-Tracking-App

**Pitch**: I will create a Film Shoot Tracking App that serves as a platform for cast and crew members in the filmmaking industry to connect and share information about upcoming film shoots within their local area. This app fills a significant need for networking and collaboration among film professionals, especially in communities where film projects are less publicized. Currently, many local shoots are announced in Facebook Groups or similar methods, but without any standardized system across the country, it’s in clear need of an upgrade. By providing a centralized source of information, it will help users find opportunities, cast calls, and crew positions, making it easier to participate in local projects.


**Initial Requirements**:

    • User accounts: Allow users to create profiles and connect with others. 


    • Posting shoots: Users can post film shoot information, including: 


        ◦ Audition details (time, location, signups)


        ◦ Character roles 


        ◦ Location and time 


        ◦ Crew and extras needed 


        ◦ Contact information 


        ◦ Rideshare and transportation info


        ◦ Pictures


    • Geolocation features: Users can filter shoot information based on distance from their current location. 


    • Feed system: A scrolling feed for users to view upcoming shoots, sorted by distance or time. Past shoots will be accessible within the system, but not within the feed as to avoid confusion.


    • Search functionality: Users can search for specific roles or skills. 


    • Direct Messaging: Users can directly message eachother to share information, ask specific questions, etc.





**Technologies**:


    • Web Page, primarily made in React.


    • Backend Server: A RESTful API that handles requests from the web page app, manages user data, and facilitates postings and interactions. Code written in TypeScript.


    • Database: A relational database (e.g., PostgreSQL or MySQL) to store user profiles, postings, and other necessary data. I'm also considering using Prisma due to my familarity with the program.


    • Geolocation Services: Integration with mapping services (like Google Maps or Mapbox) for location tracking and radius search functionality.