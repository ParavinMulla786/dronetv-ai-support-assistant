# Local MongoDB setup

1. Install MongoDB Community Server for your operating system.
2. Start the MongoDB service.
3. Verify with `mongosh` and run:
   ```javascript
   show dbs
   ```
4. The application connects to `mongodb://127.0.0.1:27017/dronetv_assistant` by default. MongoDB creates the database and collections when the first admin or enquiry is written.
5. Run `npm run create-admin` from `backend/` after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. Admin passwords are stored as bcrypt hashes.
6. Enquiries are stored in the `enquiries` collection; admin accounts are stored in the `admins` collection.

For a fresh demo database, use the local MongoDB shell carefully. Dropping a database permanently deletes its data.
