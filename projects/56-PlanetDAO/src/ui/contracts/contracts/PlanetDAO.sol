// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract PlanetDAO {
  struct dao_uri_struct {
    string dao_wallet;
    string dao_uri;
    string finished;
  }
  struct goal_uri_struct {
    string dao_id;
    string goal_uri;
  }

  struct ideas_uri_struct {
    uint256 goal_id;
    string ideas_uri;
    uint256 donation;
  }

  struct donation_struct {
    uint256 ideas_id;
    uint256 userid;
    uint256 donation;
  }

  struct smart_contract_uri_struct {
    uint256 smart_contract_id;
    uint256 ideas_id;
    string smart_contract_uri;
  }
  struct goal_ideas_votes_struct {
    uint256 goal_id;
    uint256 ideas_id;
    uint256 user_id;
  }
  struct message_struct {
    uint256 message_id;
    uint256 ideas_id;
    string message;
    string sender;
  }
  struct message_read_struct {
    uint256 message_id;
    uint256 ideas_id;
    uint256 user_id;
    string msg_type;
  }
  struct reply_struct {
    uint256 reply_id;
    uint256 message_id;
    uint256 ideas_id;
    string message;
  }

  struct UnbondingRequest {
    int64 completionTime;
    uint256 amount;
  }

  struct join_struct {
    uint256 daoid;
    uint256 user_id;
  }

  struct user_badge_struct {
    uint256 user_id;
    bool dao;
    bool joined;
    bool goal;
    bool ideas;
    bool vote;
    bool donation;
    bool comment;
    bool reply;
  }

  struct feed_struct {
    uint256 feed_id;
    uint256 date;
    string Type;
    string data;
  }
  uint256 public _dao_ids;
  uint256 public _donations_ids;
  uint256 public _goal_ids;
  uint256 public _ideas_ids;
  uint256 public _join_ids;
  uint256 public _smart_contract_ids;
  uint256 public _ideas_vote_ids;
  uint256 public _message_ids;
  uint256 public _message_read_ids;
  uint256 public _reply_ids;
  uint256 public _feed_ids;
  mapping(uint256 => dao_uri_struct) public _dao_uris; //_dao_ids              => (Dao)                    Dao Wallet + Dao URI   + Finished
  mapping(uint256 => string) public _template_uris; //_dao_ids              => (Dao)                   Template HTML Code
  mapping(uint256 => join_struct) public _joined_person; //_join_ids             => (Dao)                  join_struct

  mapping(uint256 => goal_uri_struct) public _goal_uris; //_goal_ids             => (Goal)                   Dao ID + Goal URI
  mapping(uint256 => ideas_uri_struct) public _ideas_uris; //_ideas_ids            => (Ideas)                  Goal ID + Ideas URI
  mapping(uint256 => uint256) public _donated; //uint256            => (Donated to ideas)                amount
  mapping(uint256 => feed_struct) public _feeds; //_feed_ids            => (feed_struct)
  mapping(uint256 => donation_struct) public _donations; //uint256            => donation_struct
  mapping(uint256 => smart_contract_uri_struct) public _smart_contracts_uris; //_smart_contract_ids   => (Ideas Smart contract)   Goal ID + Ideas URI
  mapping(uint256 => goal_ideas_votes_struct) public all_goal_ideas_votes; //_ideas_vote_ids       => (Vote)                   Goal ID + Ideas ID + User Id

  mapping(uint256 => message_struct) public all_messages; // all_messages        => _message_ids + message_struct

  mapping(uint256 => message_read_struct) public all_read_messages; // all_read_messages        => _message_read_ids + message_read_struct

  mapping(uint256 => reply_struct) public all_replies; // all_messages        => _reply_ids + reply_struct
  mapping(uint256 => user_badge_struct) public _user_badges; //user_id            => user_badge_struct

  //Daos
  function create_dao(string memory _dao_wallet, string memory _dao_uri, string memory _template, uint256 user_id) public returns (uint256) {
    //Create Dao into _dao_uris
    _dao_uris[_dao_ids] = dao_uri_struct(_dao_wallet, _dao_uri, 'False');
    _template_uris[_dao_ids] = _template;
    _user_badges[user_id].dao = true;
    _dao_ids++;

    return _dao_ids;
  }

  function update_template(uint256 _dao_id, string memory _template) public {
    _template_uris[_dao_id] = _template;
  }

  function set_dao(uint256 _dao_id, string memory _dao_wallet, string memory _dao_uri) public {
    //Set Dao of wallet and uri
    _dao_uris[_dao_id].dao_wallet = _dao_wallet;
    _dao_uris[_dao_id].dao_uri = _dao_uri;
  }

  function get_all_daos() public view returns (string[] memory) {
    //Getting all doas
    string[] memory _StoreInfo = new string[](_dao_ids);
    for (uint256 i = 0; i < _dao_ids; i++) {
      _StoreInfo[i] = _dao_uris[i].dao_uri;
    }

    return _StoreInfo;
  }

  function dao_uri(uint256 _dao_id) public view returns (string memory) {
    //Getting one dao URI
    return _dao_uris[_dao_id].dao_uri;
  }

  function add_Feed(string memory feed_text, string memory _type) public {
    _feeds[_feed_ids] = feed_struct(_feed_ids, block.timestamp, _type, feed_text);
    _feed_ids++;
  }

  //Goals
  function create_goal(string memory _goal_uri, string memory _dao_id, uint256 _user_id, string memory _feed) public returns (uint256) {
    //Create goal into _goal_uris
    _goal_uris[_goal_ids] = goal_uri_struct(_dao_id, _goal_uri);

    _user_badges[_user_id].goal = true;
    _goal_ids++;
    add_Feed(_feed, 'goal');

    return _goal_ids;
  }

  function set_goal(uint256 _goal_id, string memory _goal_uri) public {
    //Set goal uri
    _goal_uris[_goal_id].goal_uri = _goal_uri;
  }

  function get_all_goals() public view returns (string[] memory) {
    //Getting all goals
    string[] memory _StoreInfo = new string[](_goal_ids);
    for (uint256 i = 0; i < _goal_ids; i++) {
      _StoreInfo[i] = _goal_uris[i].goal_uri;
    }

    return _StoreInfo;
  }

  function get_all_goals_by_dao_id(string memory _dao_id) public view returns (string[] memory) {
    //Getting all goals by dao id
    string[] memory _StoreInfo = new string[](_goal_ids);
    uint256 _store_id;
    for (uint256 i = 0; i < _goal_ids; i++) {
      if (keccak256(bytes(_goal_uris[i].dao_id)) == keccak256(bytes(_dao_id))) {
        _StoreInfo[_store_id] = _goal_uris[i].goal_uri;
        _store_id++;
      }
    }

    return _StoreInfo;
  }

  function get_goal_id_by_goal_uri(string memory _goal_uri) public view returns (uint256) {
    //Getting goal id by uri
    for (uint256 i = 0; i < _goal_ids; i++) {
      if (keccak256(bytes(_goal_uris[i].goal_uri)) == keccak256(bytes(_goal_uri))) return i;
    }

    return 0;
  }
  
  function get_dao_id_by_ideas_id(uint256 ideas_id) public view returns (string memory) {
    
    uint256 goal_id= _ideas_uris[ideas_id].goal_id;
    string memory dao_id = _goal_uris[goal_id].dao_id;
    
    return dao_id;
  }

  function goal_uri(uint256 _goal_id) public view returns (string memory) {
    //Getting one goal URI
    return _goal_uris[_goal_id].goal_uri;
  }

  //Ideas
  function create_ideas(string memory _ideas_uri, uint256 _goal_id, string[] memory _smart_contracts, uint256 _user_id, string memory _feed) public returns (uint256) {
    //Create ideas into _ideas_uris
    _ideas_uris[_ideas_ids] = ideas_uri_struct(_goal_id, _ideas_uri, 0);
    _user_badges[_user_id].ideas = true;
    _ideas_ids++;

    for (uint256 i = 0; i < _smart_contracts.length; i++) {
      create_ideas_smart_contract(_ideas_ids, _smart_contract_ids, _smart_contracts[i]);
      _smart_contract_ids++;
    }
    add_Feed(_feed, 'idea');

    return _ideas_ids;
  }

  function create_ideas_smart_contract(uint256 _ideas_id, uint256 _smart_contract_id, string memory _smart_contract) private {
    _smart_contracts_uris[_smart_contract_id] = smart_contract_uri_struct(_ideas_id, _smart_contract_id, _smart_contract);
  }

  function set_ideas(uint256 _ideas_id, string memory _ideas_uri) public {
    _ideas_uris[_ideas_id].ideas_uri = _ideas_uri;
  }

  function add_donation(uint256 _ideas_id, uint256 _doantion, uint256 _userid, string memory _feed1, string memory _feed2) public {
    if (_user_badges[_userid].donation == false) {
      add_Feed(_feed1, 'badge');
    }
    add_Feed(_feed2, 'donation');

    _user_badges[_userid].donation = true;
    _ideas_uris[_ideas_id].donation += _doantion;
    _donated[_userid] += _doantion;
    _donations[_donations_ids] = donation_struct(_ideas_id, _userid, _doantion);
    _donations_ids++;
  }

  function join_community(uint256 dao_id, uint256 person, string memory _feed) public {
    _user_badges[person].joined = true;
    _joined_person[_join_ids] = join_struct({daoid: dao_id, user_id: person});
    _join_ids++;
    add_Feed(_feed, 'join');
  }

  function leave_community(uint256 join_id) public {
    _joined_person[join_id] = join_struct({daoid: 9999, user_id: 9999});
  }

  function is_person_joined(uint256 dao_id, uint256 person) public view returns (bool) {
    for (uint256 i = 0; i < _join_ids; i++) {
      if ((_joined_person[i].user_id == person) && (_joined_person[i].daoid == dao_id)) return true;
    }

    return false;
  }

  function get_person_joinedID(uint256 dao_id, uint256 person) public view returns (uint256) {
    for (uint256 i = 0; i < _join_ids; i++) {
      if ((_joined_person[i].user_id == person) && (_joined_person[i].daoid == dao_id)) return i;
    }

    return 9999;
  }

  function get_all_ideas() public view returns (string[] memory) {
    //Getting all ideas
    string[] memory _StoreInfo = new string[](_ideas_ids);
    for (uint256 i = 0; i < _ideas_ids; i++) {
      _StoreInfo[i] = _ideas_uris[i].ideas_uri;
    }

    return _StoreInfo;
  }

  function get_all_ideas_by_goal_id(uint256 _goal_id) public view returns (string[] memory) {
    //Getting all ideas by goal id
    string[] memory _StoreInfo = new string[](_ideas_ids);
    uint256 _store_id;
    for (uint256 i = 0; i < _ideas_ids; i++) {
      if (_ideas_uris[i].goal_id == _goal_id) _StoreInfo[_store_id] = _ideas_uris[i].ideas_uri;
      _store_id++;
    }

    return _StoreInfo;
  }

  function get_ideas_id_by_ideas_uri(string memory _ideas_uri) public view returns (uint256) {
    //Getting ideas id by uri
    for (uint256 i = 0; i < _ideas_ids; i++) {
      if (keccak256(bytes(_ideas_uris[i].ideas_uri)) == keccak256(bytes(_ideas_uri))) return i;
    }

    return 0;
  }

  function get_goal_id_from_ideas_uri(string memory _ideas_uri) public view returns (uint256) {
    //Getting ideas id by uri
    for (uint256 i = 0; i < _ideas_ids; i++) {
      if (keccak256(bytes(_ideas_uris[i].ideas_uri)) == keccak256(bytes(_ideas_uri))) return _ideas_uris[i].goal_id;
    }

    return 0;
  }

  function ideas_uri(uint256 _ideas_id) public view returns (string memory) {
    //Getting one ideas URI
    return _ideas_uris[_ideas_id].ideas_uri;
  }

  //Votes
  function create_goal_ideas_vote(uint256 _goal_id, uint256 _ideas_id, uint256 _user_id, string memory _feed,bool  feed_add) public returns (uint256) {
    _user_badges[_user_id].vote = true;
    //Create votes into all_goal_ideas_votes
    all_goal_ideas_votes[_ideas_vote_ids] = goal_ideas_votes_struct(_goal_id, _ideas_id, _user_id);
    _ideas_vote_ids++;
    if (feed_add){
        add_Feed(_feed, 'vote');
    }

    return _ideas_vote_ids;
  }

  function get_ideas_votes_from_goal(uint256 _goal_id, uint256 _ideas_id) public view returns (string[] memory) {
    //gets all ideas votes from goal
    string[] memory _StoreInfo = new string[](_ideas_vote_ids);
    uint256 _store_id;
    for (uint256 i = 0; i < _ideas_vote_ids; i++) {
      if (all_goal_ideas_votes[i].goal_id == _goal_id && all_goal_ideas_votes[i].ideas_id == _ideas_id) _StoreInfo[_store_id] = Strings.toString(all_goal_ideas_votes[i].user_id);
      _store_id++;
    }
    return _StoreInfo;
  }

  //Messages
  function sendMsg(uint256 _ideas_id, string memory _message, string memory _sender, uint256 _user_id) public returns (uint256) {
    _user_badges[_user_id].comment = true;
    //Create messsage into all_messages
    all_messages[_message_ids] = message_struct(_message_ids, _ideas_id, _message, _sender);
    _message_ids++;

    return _message_ids;
  }

  function getMsgIDs(uint256 ideas_id) public view returns (uint256[] memory) {
    //Getting all messages ids by idea id
    uint256[] memory _All_Ideas_Messages = new uint256[](_message_ids);
    uint256 _msg_id;
    for (uint256 i = 0; i < _message_ids; i++) {
      if (all_messages[i].ideas_id == ideas_id) {
        _All_Ideas_Messages[_msg_id] = all_messages[i].message_id;
        _msg_id++;
      }
    }

    return _All_Ideas_Messages;
  }

  function sendReply(uint256 _message_id, string memory _reply, uint256 ideas_id, uint256 _userid) public returns (uint256) {
    _user_badges[_userid].reply = true;
    //Create reply into all_replies
    all_replies[_reply_ids] = reply_struct(_reply_ids, _message_id, ideas_id, _reply);
    _reply_ids++;

    return _reply_ids;
  }

  function getReplyIDs(uint256 message_id) public view returns (uint256[] memory) {
    //Getting all messages ids by idea id
    uint256[] memory _All_Messages_Replys = new uint256[](_reply_ids);
    uint256 _reply_id;
    for (uint256 i = 0; i < _reply_ids; i++) {
      if (all_replies[i].message_id == message_id) {
        _All_Messages_Replys[_reply_id] = all_replies[i].reply_id;
        _reply_id++;
      }
    }

    return _All_Messages_Replys;
  }

  function sendReadMsg(uint256 _message_id, uint256 _ideas_id, uint256 _wallet, string memory msg_type) public returns (uint256) {
    //Create messsage into all_messages
    all_read_messages[_message_read_ids] = message_read_struct(_message_id, _ideas_id, _wallet, msg_type);
    _message_read_ids++;

    return _message_read_ids;
  }

  function getReadMsg(uint256 _message_id, string memory msg_type) public view returns (bool) {
    bool read = false;
    for (uint256 i = 0; i < _message_read_ids; i++) {
      if (all_read_messages[i].message_id == _message_id && keccak256(bytes(msg_type)) == keccak256(bytes(all_read_messages[i].msg_type))) {
        read = true;
      }
    }

    return read;
  }

  function reset_all() public {
    for (uint256 i = 0; i < _dao_ids; i++) delete _dao_uris[i];
    for (uint256 i = 0; i < _goal_ids; i++) delete _goal_uris[i];
    for (uint256 i = 0; i < _ideas_ids; i++) delete _ideas_uris[i];
    for (uint256 i = 0; i < _goal_ids; i++) delete _smart_contracts_uris[i];
    for (uint256 i = 0; i < _message_ids; i++) delete all_messages[i];
    for (uint256 i = 0; i < _reply_ids; i++) delete all_replies[i];
    for (uint256 i = 0; i < _ideas_vote_ids; i++) delete all_goal_ideas_votes[i];
    _dao_ids = 0;
    _goal_ids = 0;
    _ideas_ids = 0;
    _message_ids = 0;
    _reply_ids = 0;
    _ideas_vote_ids = 0;
  }
}
