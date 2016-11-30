@extends('admin.main')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
					<div class="panel-body">
						<div class="panel panel-default">
							<div class="panel-heading">
							   Quote  was published
							</div>
	
							<div class="panel-body">
								The link is here:
								<b></b><a href="{{ url('/quote', $quote_guid)  }}">LINK</a></b>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
