<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site1.Master" CodeBehind="Samples.aspx.vb" Inherits="Toolbox.Samples" %>

<%@ Register Assembly="Tab" Namespace="Tab" TagPrefix="cc1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        .noDisplay {
            display: none;
        }

        .displaySortArrayInfo {
            border-collapse: collapse;
        }

            .displaySortArrayInfo td {
                border: solid black 1px;
                padding: 2px;
                width: 15px;
                text-align: center;
            }

        .displaySuggestArrayItem {
            display: inline-block;
            width: 100%;
            background-color: green;
        }
    </style>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="HeaderPlaceHolder" runat="server">
</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="FooterPlaceHolder" runat="server">
    <script src="/Scripts/PathFinderTab.js" type="text/javascript"></script>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder" runat="server">
    <cc1:Tab ID="tab0" runat="server" Path="NumberConversions" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab1" runat="server" Path="Sorts" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab2" runat="server" Path="Searches" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab3" runat="server" Path="BinaryTrees" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab4" runat="server" Path="Heaps" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab5" runat="server" Path="Tries" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab6" runat="server" Path="Clocks" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab7" runat="server" Path="InfoSlides" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab8" runat="server" Path="WaitIcons" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab9" runat="server" Path="Fibonacci" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab10" runat="server" Path="PathFinder" FileName="Samples"></cc1:Tab>
    <cc1:Tab ID="tab11" runat="server" Path="HoverEffects" FileName="Samples"></cc1:Tab>
    <div>
        <cc1:TabDestination ID="tabSwapContainer" runat="server" CssClass="Card" Style="color: red;"></cc1:TabDestination>
    </div>
    <script type="text/javascript">
        var defaultTab = "tab10";

        tab.addTabs("tab");
        tab.showTab(document.getElementById(defaultTab));
    </script>
</asp:Content>
