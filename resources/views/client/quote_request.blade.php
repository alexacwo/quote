@extends('layouts.client.index')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Request a quote</div>

                    <div class="panel-body">

                        <form action="{{url('/create-quote-request')}}" method="POST">
                            {{ csrf_field() }}

                            <div class="form-group">
                                <label for="sel1">Select copier:</label>
                                @if (count($copiers) > 0)
                                    <select class="form-control" name="devices_to_quote" id="sel1">
                                        @foreach ($copiers as $copier)
                                            <option value="{{ $copier->id }}">{{ $copier->model }}</option>
                                        @endforeach
                                    </select>
                                @endif
                            </div>

                            <div class="form-group">
                                <label for="email">Your email:</label>
                                <input type="email" name="email" class="form-control" id="email">
                            </div>

                            <div class="form-group">
                                <div class="col-sm-3">
                                    <button type="submit" class="btn btn-default">
                                        <i class="fa fa-plus"></i> Send a request
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection