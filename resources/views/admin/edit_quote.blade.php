@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Edit quote #{{ $quote->id }}
                        </div>

                        <div class="panel-body">
                            <form action="{{url('/admin/save-quote')}}" method="POST">

                               <br> {{ $copier->id }}
                                <br>{{ $copier->model }}
                                <br><br>
                                {{ csrf_field() }}
                                {{ Form::hidden('quote_id', $quote->id ) }}
                                {{ Form::hidden('quote_request_status_action', $quote_request_status_action ) }}
                                <button type="submit" class="btn btn-primary">
                                    @if ($quote_request_status_action == 'to_be_completed')
                                        Publish
                                    @else
                                        Save
                                    @endif
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
