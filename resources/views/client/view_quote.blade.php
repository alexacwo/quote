@extends('layouts.client.index')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">QUOTE:</div>

                    <div class="panel-body">
                        Here is the quote #{{ $quote->id }}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

