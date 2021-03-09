-BUG #1:  npm run seed does nothing but create error messages.  I don't think this is one of the intentional bugs (I think it was just written specifically for Apple computers), and I'm not aware of a way to write tests for it, or to make comments in a json file explaining what I changed.  Anyway, I completely rewrote this so it actually does what was intended, although I probably broke it for Apples. 

-BUG #2:  authUser() decodes token instead of verifying.

-BUG #3:  There is no validation for database inputs.  Since the schema is so simple this could have been solved pretty easily with an "if" statement, but one of the docstrings mentioned that we are using jsonschema (which in reality was not included in any way in the original code) so I assumed that's the solution they are looking for.  I'm not sure if this is considered one bug or two, since it affects both the registration and update routes.

-BUG #4:  The second half of bug #3.  I'm assuming this is meant to be two separate bugs, since it affects two entirely different routes.  I treated registration as bug #3 and updating as bug #4.

-BUG #5:  PATCH users/username does not allow user to update self.  requireAdmin middleware was restricting non-admins from accessing the route, even if they are the user being updated.

-BUG #6:  auth/login does not await User.authenticate, which allows anyone to receive a login token regardless of credentials entered.

-BUG #7:  auth/login does not check that username and password are both submitted.  This may not be considered a bug; it won't allow you to login without both parameters (at least after bug #6 was fixed), but it just goes back to the generic code 500 error handler rather than anything specific to the problem.

-BUG #8:  I'm also not sure if this is really a bug or not because it doesn't seem to affect the code in any way I can find, but User.getAll() accepts username and password arguments for no reason that I can figure out.  I removed them but I'm not sure how I would write a test for it since I don't see where it actually does anything.

BUG #9:  DELETE users/username does not await results, so it doesn't catch if there is an error (usually from entering invalid username).