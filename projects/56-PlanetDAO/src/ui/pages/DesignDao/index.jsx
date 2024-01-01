import grapesjs from 'grapesjs';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { gjsPlugin } from '../../components/plugin/gjsPlugin';
import UseFormInput from '../../components/components/UseFormInput';

import useContract from '../../services/useContract';

import gjs_blocks_basic from 'grapesjs-blocks-basic';
import grapesjs_custom_code from 'grapesjs-custom-code';
import grapesjs_parser_postcss from 'grapesjs-parser-postcss';
import grapesjs_plugin_export from 'grapesjs-plugin-export';
import grapesjs_plugin_forms from 'grapesjs-plugin-forms';
import grapesjs_preset_webpage from 'grapesjs-preset-webpage';
import grapesjs_style_bg from 'grapesjs-style-bg';
import grapesjs_tooltip from 'grapesjs-tooltip';
import grapesjs_tui_image_editor from 'grapesjs-tui-image-editor';
import grapesjs_typed from 'grapesjs-typed';
import 'grapesjs/dist/css/grapes.min.css';
import isServer from '../../components/isServer';
import { Button, Input } from '@heathmont/moon-core-tw';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import { toast } from 'react-toastify';

let DaoURI = { Title: '', Description: '', SubsPrice: 0, Start_Date: '', End_Date: '', logo: '', wallet: '', typeimg: '', allFiles: [], isOwner: false };
let rendered = false;
export default function DesignDao() {
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  const { contract, signerAddress, sendTransaction } = useContract();
  const { api, showToast, userWalletPolkadot,userSigner, PolkadotLoggedIn } = usePolkadotContext();
  const [dao_type, setDaoType] = useState("metamask");

  const [editor, setEditor] = useState(null);
  const regex = /\[(.*)\]/g;
  let m;
  let id = ''; //id from url

  useEffect(() => {
    getDaoID();
    fetchAll();
  }, [contract, api]);


  function getDaoID() {
    const str = decodeURIComponent(window.location.search);

    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      let dao_type = m[1].startsWith("m_") ? "metamask" : "polkadot";
      setDaoType(dao_type);
      let splitter = dao_type =="metamask"?"m_":"p_"
      id =(Number(m[1].split(splitter)[1]));
    }
  }


  async function LoadEditor() {
    if (editor != null) return;
    var editor = grapesjs.init({
      container: '#editor',
      fromElement: true,
      showOffsets: true,
      storageManager: false,

      autosave: false, // Store data automatically
      autoload: false, // Autoload stored data on init
      assetManager: {
        embedAsBase64: true
      },

      styleManager: {
        sectors: [
          {
            name: 'General',
            properties: [
              {
                extend: 'float',
                type: 'radio',
                default: 'none',
                options: [
                  { value: 'none', className: 'fa fa-times' },
                  { value: 'left', className: 'fa fa-align-left' },
                  { value: 'right', className: 'fa fa-align-right' }
                ]
              },
              'display',
              { extend: 'position', type: 'select' },
              'top',
              'right',
              'left',
              'bottom'
            ]
          },
          {
            name: 'Dimension',
            open: false,
            properties: [
              'width',
              {
                id: 'flex-width',
                type: 'integer',
                name: 'Width',
                units: ['px', '%'],
                property: 'flex-basis',
                toRequire: 1
              },
              'height',
              'max-width',
              'min-height',
              'margin',
              'padding'
            ]
          },
          {
            name: 'Typography',
            open: false,
            properties: [
              'font-family',
              'font-size',
              'font-weight',
              'letter-spacing',
              'color',
              'line-height',
              {
                extend: 'text-align',
                options: [
                  { id: 'left', label: 'Left', className: 'fa fa-align-left' },
                  { id: 'center', label: 'Center', className: 'fa fa-align-center' },
                  { id: 'right', label: 'Right', className: 'fa fa-align-right' },
                  { id: 'justify', label: 'Justify', className: 'fa fa-align-justify' }
                ]
              },
              {
                property: 'text-decoration',
                type: 'radio',
                default: 'none',
                options: [
                  { id: 'none', label: 'None', className: 'fa fa-times' },
                  { id: 'underline', label: 'underline', className: 'fa fa-underline' },
                  { id: 'line-through', label: 'Line-through', className: 'fa fa-strikethrough' }
                ]
              },
              'text-shadow'
            ]
          },
          {
            name: 'Decorations',
            open: false,
            properties: [
              'opacity',
              'border-radius',
              'border',
              'box-shadow',
              'background' // { id: 'background-bg', property: 'background', type: 'bg' }
            ]
          },
          {
            name: 'Extra',
            open: false,
            buildProps: ['transition', 'perspective', 'transform']
          },
          {
            name: 'Flex',
            open: false,
            properties: [
              {
                name: 'Flex Container',
                property: 'display',
                type: 'select',
                defaults: 'block',
                list: [
                  { value: 'block', name: 'Disable' },
                  { value: 'flex', name: 'Enable' }
                ]
              },
              {
                name: 'Flex Parent',
                property: 'label-parent-flex',
                type: 'integer'
              },
              {
                name: 'Direction',
                property: 'flex-direction',
                type: 'radio',
                defaults: 'row',
                list: [
                  {
                    value: 'row',
                    name: 'Row',
                    className: 'icons-flex icon-dir-row',
                    title: 'Row'
                  },
                  {
                    value: 'row-reverse',
                    name: 'Row reverse',
                    className: 'icons-flex icon-dir-row-rev',
                    title: 'Row reverse'
                  },
                  {
                    value: 'column',
                    name: 'Column',
                    title: 'Column',
                    className: 'icons-flex icon-dir-col'
                  },
                  {
                    value: 'column-reverse',
                    name: 'Column reverse',
                    title: 'Column reverse',
                    className: 'icons-flex icon-dir-col-rev'
                  }
                ]
              },
              {
                name: 'Justify',
                property: 'justify-content',
                type: 'radio',
                defaults: 'flex-start',
                list: [
                  {
                    value: 'flex-start',
                    className: 'icons-flex icon-just-start',
                    title: 'Start'
                  },
                  {
                    value: 'flex-end',
                    title: 'End',
                    className: 'icons-flex icon-just-end'
                  },
                  {
                    value: 'space-between',
                    title: 'Space between',
                    className: 'icons-flex icon-just-sp-bet'
                  },
                  {
                    value: 'space-around',
                    title: 'Space around',
                    className: 'icons-flex icon-just-sp-ar'
                  },
                  {
                    value: 'center',
                    title: 'Center',
                    className: 'icons-flex icon-just-sp-cent'
                  }
                ]
              },
              {
                name: 'Align',
                property: 'align-items',
                type: 'radio',
                defaults: 'center',
                list: [
                  {
                    value: 'flex-start',
                    title: 'Start',
                    className: 'icons-flex icon-al-start'
                  },
                  {
                    value: 'flex-end',
                    title: 'End',
                    className: 'icons-flex icon-al-end'
                  },
                  {
                    value: 'stretch',
                    title: 'Stretch',
                    className: 'icons-flex icon-al-str'
                  },
                  {
                    value: 'center',
                    title: 'Center',
                    className: 'icons-flex icon-al-center'
                  }
                ]
              },
              {
                name: 'Flex Children',
                property: 'label-parent-flex',
                type: 'integer'
              },
              {
                name: 'Order',
                property: 'order',
                type: 'integer',
                defaults: 0,
                min: 0
              },
              {
                name: 'Flex',
                property: 'flex',
                type: 'composite',
                properties: [
                  {
                    name: 'Grow',
                    property: 'flex-grow',
                    type: 'integer',
                    defaults: 0,
                    min: 0
                  },
                  {
                    name: 'Shrink',
                    property: 'flex-shrink',
                    type: 'integer',
                    defaults: 0,
                    min: 0
                  },
                  {
                    name: 'Basis',
                    property: 'flex-basis',
                    type: 'integer',
                    units: ['px', '%', ''],
                    unit: '',
                    defaults: 'auto'
                  }
                ]
              },
              {
                name: 'Align',
                property: 'align-self',
                type: 'radio',
                defaults: 'auto',
                list: [
                  {
                    value: 'auto',
                    name: 'Auto'
                  },
                  {
                    value: 'flex-start',
                    title: 'Start',
                    className: 'icons-flex icon-al-start'
                  },
                  {
                    value: 'flex-end',
                    title: 'End',
                    className: 'icons-flex icon-al-end'
                  },
                  {
                    value: 'stretch',
                    title: 'Stretch',
                    className: 'icons-flex icon-al-str'
                  },
                  {
                    value: 'center',
                    title: 'Center',
                    className: 'icons-flex icon-al-center'
                  }
                ]
              }
            ]
          }
        ]
      },
      plugins: [gjsPlugin, gjs_blocks_basic, grapesjs_plugin_forms, grapesjs_plugin_export, grapesjs_custom_code, grapesjs_parser_postcss, grapesjs_tooltip, grapesjs_tui_image_editor, grapesjs_typed, grapesjs_style_bg, grapesjs_preset_webpage],
      pluginsOpts: {
        gjs_blocks_basic: { flexGrid: true },
        'grapesjs-tui-image-editor': {
          script: [
            // 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.7/fabric.min.js',
            'https://uicdn.toast.com/tui.code-snippet/v1.5.2/tui-code-snippet.min.js',
            'https://uicdn.toast.com/tui-color-picker/v2.2.7/tui-color-picker.min.js',
            'https://uicdn.toast.com/tui-image-editor/v3.15.2/tui-image-editor.min.js'
          ],
          style: ['https://uicdn.toast.com/tui-color-picker/v2.2.7/tui-color-picker.min.css', 'https://uicdn.toast.com/tui-image-editor/v3.15.2/tui-image-editor.min.css']
        },
        'grapesjs-tabs': {
          tabsBlock: { category: 'Extra' }
        },
        'grapesjs-typed': {
          block: {
            category: 'Extra',
            content: {
              type: 'typed',
              'type-speed': 40,
              strings: ['Text row one', 'Text row two', 'Text row three']
            }
          }
        },
        'grapesjs-preset-webpage': {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function (editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          }
        }
      },
      canvas: {
        styles: ['https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css', '/output.css', '/css/daos.css', '/theme.css', '/css/ideas.css'],
        scripts: ['https://code.jquery.com/jquery-3.3.1.slim.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js']
      }
    });
    setEditor(editor);
    window.editorGJ = editor;
  }

  async function fetchAll() {
    if (typeof window == 'undefined' || contract === null || id === null) {
      return null;
    }
    await fetchContractData();
  }
  async function SaveHTML() {
    const ToastId = toast.loading('Updating ...');

    let output = editor.getHtml() + '<style>' + editor.getCss() + '</style>';
    if (PolkadotLoggedIn) {
      await api._extrinsics.daos.updateTemplate(Number(id), output).signAndSend(userWalletPolkadot, { signer: userSigner }, (status) => {
        showToast(status, ToastId, 'Updated Successfully!', ()=>{});
      });
    } else {

      // Saving HTML in Smart contract from metamask chain
      await sendTransaction(await window.contract.populateTransaction.update_template(Number(id), output));
      toast.update(ToastId, {
        render: 'Updated Successfully!', type: "success", isLoading: false, autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true
      });
    }
  }

  async function UpdateDaoData(dao_uri, template_html) {
    document.querySelector('#dao-container').innerHTML = template_html;
    rendered = true;
    const daoURI = JSON.parse(dao_uri); //Getting dao URI

    DaoURI = {
      Title: daoURI.properties.Title.description,
      Description: daoURI.properties.Description.description,
      Start_Date: daoURI.properties.Start_Date.description,
      logo: daoURI.properties.logo.description,
      wallet: daoURI.properties.wallet.description,
      typeimg: daoURI.properties.typeimg.description,
      allFiles: daoURI.properties.allFiles.description,
    };
    LoadEditor();


  }

  async function fetchContractData() {
    if (contract && id != null && !rendered) {
      //Fetching data from Parachain
      if (api && dao_type == 'polkadot') {
        try {
          const element = await api._query.daos.daoById(Number(id));
          let daoURI = element['__internal__raw'].daoUri.toString();
          let template_html = (await api._query.daos.templateById(id)).toString();
          UpdateDaoData(daoURI, template_html);
        } catch (e) { }

      }
      if (contract && dao_type == 'metamask') {
        //Load everything-----------
        const daoURI = (await contract.dao_uri(Number(id))); //Getting dao URI
        const template_html = await contract._template_uris(id);

        UpdateDaoData(daoURI, template_html);

      }

    }
  }


  return (
    <div>
      <Head>
        <title>Customize {DaoURI.Title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="editor">
        <div id="dao-container"></div>
      </div>
      <div className="absolute z-10 top-0 left-0 h-[85px] w-full shadow-moon-lg flex justify-between items-center p-5" style={{ background: 'linear-gradient(0deg, #EC1F52 -366.48%, #09013E 100%)' }}>
        <Input aria-label="name" className="max-w-[320px]" value={DaoURI.Title} disabled />
        <div className="flex flex-1 justify-end items-center gap-2">
          <Button variant="ghost" className="!text-white !bg-transparent" onClick={() => history.back()()}>
            Cancel
          </Button>
          <Button onClick={SaveHTML}>Save</Button>
        </div>
      </div>
    </div>
  );
}
