@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">

                    @if (count($quotes) > 0)
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                Quotes
                            </div>

                            <div class="panel-body">
                                <table class="table table-striped task-table">

                                    <thead>
                                        <th>Id</th>
                                        <th>Status</th>
                                        <th>&nbsp;</th>
                                        <th>User email</th>
                                        <th>User password</th>
                                        <th>Client link</th>
                                    </thead>

                                    <tbody>
                                        @foreach ($quotes as $quote)
                                            @php
                                                $user = App\User::where('quote_id', $quote->id)->first()
                                            @endphp
                                            <tr>
                                                <td class="table-text">
                                                    <a href="{{url('/admin/quote', $quote->id )}}">
                                                        # {{$quote->id}}
                                                    </a>
                                                </td>
                                                <td class="table-text">
                                                    <div>{{ $quote->status }}</div>
                                                </td>
                                                <td class="table-text">
                                                    Delete button
                                                </td>
                                                <td class="table-text">
                                                   @if ($user)
                                                        {{ $user->email }}
                                                    @endif
                                                </td>
                                                <td class="table-text">
                                                    @if ($user)
                                                        {{ $user->unencrypt }}
                                                    @endif
                                                </td>
                                                <td class="table-text">
                                                    <a href="{{url('/quote', $quote->id )}}">
                                                        # {{$quote->id}}
                                                    </a>
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
