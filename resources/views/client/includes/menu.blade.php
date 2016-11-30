<nav class="navbar navbar-inverse navbar-static-top">
    <div class="container">
        <div class="navbar-header">
            <!-- Collapsed Hamburger -->
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                <span class="sr-only">Toggle Navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>

        <div class="collapse navbar-collapse" id="app-navbar-collapse">
            @if (( Auth::user() && Auth::user()->role == 'admin' ))
                <ul class="nav navbar-nav navbar-left">
                    <li class="dropdown">
                        <a href="{{url('/adm')}}" role="button">
                            <b>Go to admin panel</b>
                        </a>
                    </li>
                </ul>
            @endif

            <!-- Right Side Of Navbar -->
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="{{url('/')}}" role="button">
                        Home
                    </a>
                </li>
                @if (Auth::guest())
                    <li class="dropdown">
                        <a href="{{url('/login')}}" role="button">
                            Login
                        </a>
                    </li>
                @elseif (( Auth::user()->role != 'admin' ))
                    <li class="dropdown">
                        <a href="{{url('/quote', Auth::user()->quote_id ) }}" role="button">
                            Your quote
                        </a>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                            {{ Auth::user()->name }} <span class="caret"></span>
                        </a>

                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <a href="{{ url('/logout') }}"
                                   onclick="event.preventDefault();
                                                         document.getElementById('logout-form').submit();">
                                    Logout
                                </a>

                                <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
                                    {{ csrf_field() }}
                                </form>
                            </li>
                        </ul>
                    </li>
                @endif
            </ul>
        </div>
    </div>
</nav>
