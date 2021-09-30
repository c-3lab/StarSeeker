#!/bin/bash

cd ../backend/

echo "Enter the postgreSQL user name and password you have set."

echo -n "Enter the PostgreSQL user name you set and press Enter key : "
read username

echo -n "Enter the PostgreSQL password you set and press Enter key : "
read password

echo -e -n "API_PORT=4000\nORION_URI=http://localhost:1026\nPOSTGRES_HOST=localhost\nPOSTGRES_PORT=5432\nPOSTGRES_USERNAME=$username\nPOSTGRES_PASSWORD=$password\nPOSTGRES_DATABASE=postgres\nTYPEORM_SYNCHRONIZE=false" > .env.development.local

if [ -e .env.development.local.rename ]; then
    rm -f .env.development.local.rename
    echo "Deleted testtest.txt, the configuration file before renaming."
fi

echo "The configuration file test.txt has been set up. Start the application."

cat .env.development.local

echo ""

npm install

if [ $? = 0 ]; then
        echo "Installed the backend package."
else
        echo "The backend package could not be installed, please make sure that npm is installed."
        exit 0
fi

npm run start & # Run in the background

echo "Start the backend application."

sleep 30 # Wait for the backend not to start before the frontend.

cd ../frontend/

npm install

if [ $? = 0 ]; then
        echo "Installed the frontend package."
else
        echo "The frontend  package could not be installed, please make sure that npm is installed."
        exit 0
fi

npm run dev & # Run in the background

echo "Start the frontend application."

sleep 30 # Waits to prevent users from accessing the browser before the front end is launched.

echo "The application has been launched. Go to http://localhost:80."

exit 0
