@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">

                    @if (count($quote_requests) > 0)
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                Quote Requests
                            </div>

                            <div class="panel-body">
                                <table class="table table-striped task-table">

                                    <thead>
                                        <th>Requested devices to quote</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>&nbsp;</th>
                                    </thead>

                                    <tbody>
                                    @foreach ($quote_requests as $quote_request)
                                        <tr>
                                            <td class="table-text">
                                                <div>{{ $quote_request->requested_devices_to_quote }}</div>
                                            </td>
                                            <td class="table-text">
                                                <div>{{ $quote_request->email }}</div>
                                            </td>
                                            <td class="table-text">
                                                <div>{{ $quote_request->status }}</div>
                                            </td>
                                            <td class="table-text">
                                                @if ( $quote_request->status == 'created' )
                                                    <form action="{{url('/admin/create-quote')}}" method="POST">
                                                        {{ csrf_field() }}
                                                        {{ Form::hidden('quote_request_id', $quote_request->id ) }}
                                                        <button type="submit" class="btn btn-danger">Prepare a quote</button>
                                                    </form>
                                                @elseif ( $quote_request->status == 'pending' )
                                                    <a href="{{ url('/admin/quote', $quote_request->quote_id)  }}">
                                                        <button type="submit" class="btn btn-warning">Go to quote draft</button>
                                                    </a>
                                                @else ( $quote_request->status == 'completed' )
                                                    <a href="{{ url('/admin/quote', $quote_request->quote_id)  }}">
                                                        <button type="submit" class="btn btn-success">Go to quote</button>
                                                    </a>
                                                @endif
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
