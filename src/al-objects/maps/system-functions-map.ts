import IKeyValue from "../../helpers/models/key-value.model";

/* spell-checker: disable */
class SystemFunctions implements IKeyValue {
  [prop: string]: string;

  applicationbuild = "ApplicationBuild";
  applicationversion = "ApplicationVersion";
  break = "Break";
  calcfield = "CalcField";
  caption = "Caption";
  clearall = "ClearAll";
  commit = "Commit";
  createguid = "CreateGuid";
  createtask = "CreateTask";
  delete = "Delete";
  deleteall = "DeleteAll";
  deletelinks = "DeleteLinks";
  displayname = "DisplayName";
  duplicate = "Duplicate";
  export = "Export";
  find = "Find";
  findfirst = "FindFirst";
  findlast = "FindLast";
  findset = "FindSet";
  full = "Full";
  get = "Get";
  getlasterrortext = "GetLastErrorText";
  getposition = "GetPosition";
  getrecord = "GetRecord";
  import = "Import";
  init = "Init";
  insert = "Insert";
  locktable = "LockTable";
  mark = "Mark";
  method = "Method";
  modify = "Modify";
  next = "Next";
  open = "Open";
  post = "Post";
  print = "Print";
  read = "Read";
  reset = "Reset";
  run = "Run";
  runmodal = "RunModal";
  send = "Send";
  serviceinstanceid = "ServiceInstanceId";
  sessionid = "SessionId";
  setrecfilter = "SetRecFilter";
  skip = "Skip";
  update = "Update";
  workdate = "WorkDate";
}
/* spell-checker: enable */

const SYSTEM_FUNCTIONS = new SystemFunctions();
export default SYSTEM_FUNCTIONS;
