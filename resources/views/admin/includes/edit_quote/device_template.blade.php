<div class="panel panel-info" ng-repeat="deviceOptions in addedDevices">
	<div class="panel-heading">
		<h4 class="panel-title">
			<a data-toggle="collapse" data-parent="#accordion" href="#collapse<% deviceOptions.id %>">
				<% deviceOptions.model %>
			</a>
		</h4>
	</div>
	<div id="collapse<% deviceOptions.id %>" class="panel-collapse collapse in quoted_devices_form">
		<div class="panel-body">
			
			<div class="col-md-12 accessories_block" style="margin-bottom: 20px;">
				<div class="col-md-4">
					<h4>Add accessories:</h4>
					<div class="accessories_list_container">
						<div class="accessories_list"> 
							<div class="checkbox accessory_block" ng-repeat="accessory in accessoriesList">
								<input class="accessory" type="checkbox"
									   name="added_accessories[<% deviceOptions.id %>][]"
									   value="<% accessory.id %>"
									   ng-model="selectedAccessories[deviceOptions.id][accessory.id]"
									   ng-change="acessoryStateChanged(deviceOptions.id, accessory.id)"
									   
								>
								<% accessory.part_number %> | Price: <% accessory.price %>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<h4>Chosen items:</h4>
					<div class="chosen_accessories_list_container">
						<div class="chosen_accessories_list">
							<div class="checkbox accessory_block" ng-repeat="chosenAccessory in chosenAccessoriesList[deviceOptions.id]">
								<input class="accessory" type="checkbox"
									   name="added_accessories[<% deviceOptions.id %>][]"
									   value="<% chosenAccessory.id %>"
									   ng-model="selectedAccessories[deviceOptions.id][chosenAccessory.id]"
									   ng-change="acessoryStateChanged(deviceOptions.id, chosenAccessory.id)"
								>
								<% chosenAccessory.part_number %> | Price: <% chosenAccessory.price %>
							</div>							 
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="btn btn-danger"
						 ng-click="removeDevice(deviceOptions.id)"
						 style="float: right; margin-bottom: 20px;">
						Remove Device
					</div>
					<br>
					<img ng-src="{{url('/img/devices')}}/<% deviceOptions.image %>"
						 style="display:block; width: 250px; height: auto; float: right;"/>
				</div>
			</div>
			<br> 
 			<div class="col-md-12">
				<div class="col-md-9">
					<div class="well well-sm">
						<h4>Display descriptions:</h4>
						<div class="form-group">
							<div class="checkbox">
								<input type="checkbox"
									   name="devices_desc[<% deviceOptions.id %>][pdf]"
									   value="<% deviceOptions.pdf %>"
									    ng-checked="devicesDescriptions[deviceOptions.id]['pdf']"
									   />
								<strong>Display PDF?</strong> <a href="<% deviceOptions.pdf %>">PDF link</a>
							</div>
						</div>
						<div class="form-group">
							<div class="form-group">
								<div class="checkbox">
									<input type="checkbox"
										   name="devices_desc[<% deviceOptions.id %>][color_or_mono]"
										   value="<% deviceOptions.color_or_mono %>"
										   ng-checked="devicesDescriptions[deviceOptions.id]['color_or_mono']"
										   />
									<strong>Color/mono:</strong> <% deviceOptions.color_or_mono %>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="form-group">
								<div class="checkbox">
									<input type="checkbox"
										   name="devices_desc[<% deviceOptions.id %>][paper_size]"
										   value="<% deviceOptions.paper_size %>"
										   ng-checked="devicesDescriptions[deviceOptions.id]['paper_size']"
										   />
									<strong>Paper size:</strong> <% deviceOptions.paper_size %>
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="form-group">
								<div class="checkbox">
									<input type="checkbox"
										   name="devices_desc[<% deviceOptions.id %>][speed]"
										   value="<% deviceOptions.speed %>"
										   ng-checked="devicesDescriptions[deviceOptions.id]['speed']"
										   />
									<strong>Speed:</strong> <% deviceOptions.speed %>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-3">
				</div>
			</div>
			
			<div class="col-md-12">
				<div class="col-md-6">
					<h4>Base:</h4>
					<div class="form-group">
						<div class="col-md-6">
							<label>Cost:</label>
							<input type="text" class="form-control" disabled value="<% deviceOptions.cost %>">
						</div>
						<div class="col-md-6">
							<label>Price:</label>
							<input type="text" class="form-control" name="prices[<% deviceOptions.id - 1 %>][base]" value="<% prices[ deviceOptions.id - 1].base %>">
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<h4>Additional printed pages cost:</h4>
					<div class="form-group">
						<div class="col-md-6">
							<label>Color:</label>
							<input type="text" class="form-control" disabled value="<% deviceOptions.cost_per_color_page %>">
							<br><input type="text" class="form-control" name="prices[<% deviceOptions.id - 1 %>][cost_per_color_page]" value="<% prices[ deviceOptions.id - 1].cost_per_color_page %>">
						</div>
						<div class="col-md-6">
							<label>B&W:</label>
							<input type="text" class="form-control" disabled value="<% deviceOptions.cost_per_mono_page %>">
							<br><input type="text" class="form-control" name="prices[<% deviceOptions.id - 1 %>][cost_per_mono_page]" value="<% prices[ deviceOptions.id - 1].cost_per_mono_page %>">
						</div>
					</div>
				</div>
			</div>
			
		</div>
		
	</div>
</div>