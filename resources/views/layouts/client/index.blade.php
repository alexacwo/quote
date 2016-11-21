<!DOCTYPE html>
<html lang="en">
<head>
@include('client.includes.head')
</head>
<body>
<div id="app">
    @include('client.includes.menu')
    @yield('content')
</div>

@include('client.includes.scripts')
</body>
</html>
