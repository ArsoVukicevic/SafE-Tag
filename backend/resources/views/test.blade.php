<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

    </head>
    <body>
        <form action="/insertItem" method="POST" enctype="multipart/form-data">
          First name:<br>
          <input type="text" name="firstname" value="Mickey">
          <br>
          Last name:<br>
          <input type="text" name="lastname" value="Mouse">
          <br><br>
          <input type="file" name="file">
          <input type="submit" value="Submit">
        </form>
    </body>
</html>