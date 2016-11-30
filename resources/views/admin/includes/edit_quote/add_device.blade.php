<div class="panel panel-warning">
	<div class="panel-heading">
		Device list
	</div>
	
	<div class="panel-body">
		<div class="col-md-12">
			Choose a device from a form below and press the button (max 4 allowed for now):<br>
			<div class="btn btn-danger" id="add_device" ng-click="addDeviceToQuote()">Add Device</div>
		</div>
		
		<div class="col-md-6">
			<div class="form-group">
				<strong>3 most common quoted devices:</strong>
				<div id="most_quoted">
					<div class="quoted_device_block"
						 ng-repeat="deviceId in mostQuotedDevicesIds"
						 ng-click="selectDevice(deviceId)"
						ng-class="{'ui-selected': selectedDevice == deviceId}"
					>
						<div class="device_params">
							<h4 id="device_title">
								<% devicesList[deviceId - 1].model %>
							</h4>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-6">
			<div class="form-group">
				<strong>Choose from a list below:</strong>
				<div class="devices_list_container">
					<div id="devices_list">
							 ng-repeat="device in devicesList"
						<div class="quoted_device_block"
							 ng-click="selectDevice(device.id)"
							 ng-class="{'ui-selected': selectedDevice == device.id}"
						>
							<div class="device_image">
								<img ng-src="{{url('/img/devices')}}/<% device.image %>" />
							</div>
							<div class="device_params">
								<h4 id="device_title">
									<% device.model %>
								</h4>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>