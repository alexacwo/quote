@extends('layouts.client.index')

@section('content')
    <div class="container">
        <div class="row">
			<div class="quote_main_page animate-show" ng-show="showQuoteMainPage">
				@include('client.includes.quote_main_page')			
			</div>
			
			@foreach ($quoted_devices as $quoted_device)
				<div class="quoted_device_block animate-show" ng-show="showQuotedDeviceBlock && deviceToShow[{{ $quoted_device->id }}] ">
					<div id="device_{{ $quoted_device->id }}">
						@foreach ($quote->devices_desc[$quoted_device->id] as $device_param_name => $device_param_value)
							<br>{{ $device_param_name }} => {{ $device_param_value }}
						@endforeach
						<br><br>Choose accessories:
						<br>
						@foreach ($accessories_for_devices[$quoted_device->id] as $accessory)
								<br>Id: {{ $accessory->id }}
								<br>Description: {{ $accessory->description }}
								<br>Price: {{ $accessory->price }}
						@endforeach

					</div>
				</div>
			@endforeach
			
			<div class="col-md-12">
                <div class="panel panel-default">
                    <div class="panel-heading">QUOTE:</div>

                    <div class="panel-body">
                        Here is the quote #{{ $quote->id }}
                    </div>
                    <div class="panel-body">
                        Quoted devices:
                        <ul class="nav nav-tabs">
                            @foreach ($quoted_devices as $quoted_device)
                                <li class="{{ ($loop->first) ? 'active' : '' }}">
                                    <a data-toggle="tab" href="#device_{{ $quoted_device->id }}">
                                        {{ $quoted_device->model }}
                                    </a>
                                </li>
                            @endforeach
                        </ul>

                        <div class="tab-content">
                            @foreach ($quoted_devices as $quoted_device)
                                <div id="device_{{ $quoted_device->id }}" class="tab-pane fade {{ ($loop->first) ? 'in active' : '' }}">
                                    @foreach ($quote->devices_desc[$quoted_device->id] as $device_param_name => $device_param_value)
                                        <br>{{ $device_param_name }} => {{ $device_param_value }}
                                    @endforeach
                                    <br><br>Choose accessories:
                                    <br>
                                    @foreach ($accessories_for_devices[$quoted_device->id] as $accessory)
                                            <br>Id: {{ $accessory->id }}
                                            <br>Description: {{ $accessory->description }}
                                            <br>Price: {{ $accessory->price }}
                                    @endforeach

                                </div>
                            @endforeach

                        </div>
                        <br>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

