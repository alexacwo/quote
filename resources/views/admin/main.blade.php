<!DOCTYPE html>
<html lang="en">
<head>
    @include('admin.includes.head')
    <!-- Scripts -->
    <script>
        window.Laravel = <?php echo json_encode([
                'csrfToken' => csrf_token(),
        ]); ?>
    </script>
</head>
<body>
    <div id="app">
        @include('admin.includes.menu')
        @yield('content')
    </div>

    @include('admin.includes.scripts')
</body>
</html>
