var templates = [];
var urlsToDelete = [];
function getTemplatesToDeleteTasks(start_index) {
	var input_data = {
		list_info: {
		row_count: 10,
		start_index: start_index
		}
	};
	jQuery.sdpapi.get({
		url: 'request_templates',
		data: getAsInputData(input_data),
		callback: function(response) {
		response.request_templates.forEach(function(template) {
			templates.push(template.id);
		});

		if (response.list_info.has_more_rows) {
			setTimeout(getTemplatesToDeleteTasks(start_index + 10), 1000);
		}
		else{
			urlsToDelete = [];
			setTimeout(getTasksAndDelete(), 1000);
		}
		}
	});
};
function getTasksAndDelete(){
	templates.forEach(function(templateId){
		getTemplateTasks(1,templateId);
	});
	urlsToDelete.forEach(function(url){
		jQuery.sdpapi.del({url:url,async:false});
	});
}
function getTemplateTasks(start_index,templateId) {
	var input_data = {
		list_info: {
		row_count: 10,
		start_index: start_index
		}
	};
	var url = "request_templates/"+templateId+"/tasks";
	setTimeout(jQuery.sdpapi.get({
		url: url,
		data: getAsInputData(input_data),
		async: false,
		callback: function(taskResponse) {
		taskResponse.tasks.forEach(function(task) {
			urlsToDelete.push(url+"/"+task.id);
		});
		if (taskResponse.list_info.has_more_rows) {
			setTimeout(getTemplateTasks(start_index + 10,templateId), 1000);
		}
		}
	}), 1000);
}
getTemplatesToDeleteTasks(1);